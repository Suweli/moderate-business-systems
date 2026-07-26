import { NextResponse } from 'next/server';
import {
  createPendingTestimonial,
  findRecentDuplicate,
  readApprovedTestimonialsPage,
  updateTestimonialById,
  type DbTestimonial,
} from '../../../lib/testimonials-db';
import { isAdminAuthenticated } from '../../../lib/admin-auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BLOCKED_WORDS = ['http://', 'https://', 'casino', 'viagra', 'crypto giveaway'];
const BREVO_API_BASE = 'https://api.brevo.com/v3';
const DEFAULT_APPROVAL_RECIPIENT = 'moderatebiz@yahoo.com';

export const dynamic = 'force-dynamic';

type TestimonialInput = {
  name?: string;
  company?: string;
  position?: string;
  industry?: string;
  email?: string;
  message?: string;
  rating?: number;
  honey?: string;
  startedAt?: number;
};

function sanitize(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function isLikelySpam(payload: TestimonialInput) {
  if (payload.honey) return true;
  if (!payload.startedAt || Date.now() - payload.startedAt < 1500) return true;

  const haystack = `${payload.name || ''} ${payload.company || ''} ${payload.position || ''} ${payload.industry || ''} ${payload.message || ''}`.toLowerCase();
  return BLOCKED_WORDS.some((term) => haystack.includes(term));
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function notifyModerationEmail(record: DbTestimonial, request: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return;
  }

  const recipient = process.env.TESTIMONIAL_APPROVAL_RECIPIENT || DEFAULT_APPROVAL_RECIPIENT;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || recipient;
  const senderName = process.env.BREVO_SENDER_NAME || 'Moderate Business Systems Ltd';
  const moderationKey = process.env.TESTIMONIAL_MODERATION_KEY;

  if (!moderationKey) {
    return;
  }

  const origin = new URL(request.url).origin;
  const approveUrl = `${origin}/api/testimonials/moderate?id=${record.id}&action=approve&key=${encodeURIComponent(moderationKey)}`;
  const rejectUrl = `${origin}/api/testimonials/moderate?id=${record.id}&action=reject&key=${encodeURIComponent(moderationKey)}`;

  const htmlContent = `
    <h2>New Testimonial Pending Approval</h2>
    <p>A new testimonial was submitted and is waiting for moderation.</p>
    <ul>
      <li><strong>ID:</strong> ${record.id}</li>
      <li><strong>Name:</strong> ${escapeHtml(record.name)}</li>
      <li><strong>Company:</strong> ${escapeHtml(record.company || 'Not provided')}</li>
      <li><strong>Position:</strong> ${escapeHtml(record.jobTitle || 'Not provided')}</li>
      <li><strong>Industry:</strong> ${escapeHtml(record.industry || 'Not provided')}</li>
      <li><strong>Email:</strong> ${escapeHtml(record.email)}</li>
      <li><strong>Rating:</strong> ${record.rating}/5</li>
      <li><strong>Submitted:</strong> ${escapeHtml(record.dateSubmitted)}</li>
    </ul>
    <p><strong>Testimonial:</strong><br/>${escapeHtml(record.testimonial)}</p>
    <p>
      <a href="${approveUrl}">Approve and Publish</a>
      &nbsp;|&nbsp;
      <a href="${rejectUrl}">Reject and Remove</a>
    </p>
  `;

  const response = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: recipient }],
      subject: `Testimonial Approval Needed (#${record.id})`,
      htmlContent,
      textContent: `New testimonial pending approval (#${record.id})\n\nName: ${record.name}\nCompany: ${record.company}\nPosition: ${record.jobTitle}\nIndustry: ${record.industry}\nEmail: ${record.email}\nRating: ${record.rating}/5\n\n${record.testimonial}\n\nApprove: ${approveUrl}\nReject: ${rejectUrl}`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unable to read Brevo error payload.');
    throw new Error(`Brevo moderation email failed (${response.status}): ${errorBody}`);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limitRaw = Number(searchParams.get('limit') || '6');
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 24) : 6;

  const payload = await readApprovedTestimonialsPage(page, limit);

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as TestimonialInput | null;

  if (!payload) {
    return NextResponse.json({ message: 'Invalid submission payload.' }, { status: 400 });
  }

  if (isLikelySpam(payload)) {
    return NextResponse.json({ message: 'Submission blocked by anti-spam checks.' }, { status: 400 });
  }

  const name = sanitize(payload.name || '');
  const company = sanitize(payload.company || '');
  const jobTitle = sanitize(payload.position || '');
  const industry = sanitize(payload.industry || '');
  const email = sanitize((payload.email || '').toLowerCase());
  const message = sanitize(payload.message || '');
  const rating = Number(payload.rating || 0);

  if (!name || !email || !message) {
    return NextResponse.json({ message: 'Name, email, and testimonial message are required.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: 'Please provide a valid email address.' }, { status: 400 });
  }

  if (message.length < 20) {
    return NextResponse.json({ message: 'Please provide a more detailed testimonial (at least 20 characters).' }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'Please provide a valid rating between 1 and 5.' }, { status: 400 });
  }

  const duplicateId = await findRecentDuplicate(email, message);
  if (duplicateId) {
    return NextResponse.json({ message: 'This testimonial has already been submitted recently.' }, { status: 409 });
  }

  const record = await createPendingTestimonial({
    name,
    jobTitle,
    company,
    industry,
    email,
    testimonial: message,
    rating,
  });

  try {
    await notifyModerationEmail(record, request);
  } catch (error) {
    console.error('Testimonial moderation email notification failed:', error);
  }

  return NextResponse.json({
    message: 'Thank you! Your testimonial has been submitted and is awaiting approval before publication.',
  });
}

type ModerationInput = {
  id?: number;
  action?: 'approve' | 'reject';
};

export async function PATCH(request: Request) {
  const moderationKey = process.env.TESTIMONIAL_MODERATION_KEY;
  const authHeader = request.headers.get('x-moderation-key') || '';
  const viaDashboard = isAdminAuthenticated();

  if ((!moderationKey || authHeader !== moderationKey) && !viaDashboard) {
    return NextResponse.json({ message: 'Unauthorized moderation request.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as ModerationInput | null;

  if (!payload || !payload.id || !payload.action) {
    return NextResponse.json({ message: 'Invalid moderation payload.' }, { status: 400 });
  }

  const status = payload.action === 'approve' ? 'approved' : 'rejected';
  const updated = await updateTestimonialById(payload.id, { status });

  if (!updated) {
    return NextResponse.json({ message: 'Testimonial not found.' }, { status: 404 });
  }

  return NextResponse.json({
    message: payload.action === 'approve' ? 'Testimonial approved and published.' : 'Testimonial rejected.',
  });
}
