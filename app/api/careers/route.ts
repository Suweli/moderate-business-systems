import { NextResponse } from 'next/server';

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const dynamic = 'force-dynamic';

function readEnvValue(name: string) {
  const raw = process.env[name];
  return raw && raw.trim() ? raw.trim() : null;
}

function sanitize(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString('base64');
}

export async function POST(request: Request) {
  const apiKey = readEnvValue('BREVO_API_KEY');
  const senderEmail = readEnvValue('BREVO_SENDER_EMAIL');
  const senderName = readEnvValue('BREVO_SENDER_NAME') || 'Moderate Business Systems Ltd';
  const recipient = readEnvValue('CAREERS_APPLICATION_RECIPIENT') || 'moderatebiz@yahoo.com';

  if (!apiKey || !senderEmail) {
    return NextResponse.json(
      {
        message:
          'Careers submission email is not fully configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in Vercel environment variables.',
      },
      { status: 503 },
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: 'Invalid form submission.' }, { status: 400 });
  }

  const honey = sanitize(formData.get('_honey'));
  if (honey) {
    return NextResponse.json({ message: 'Submission blocked by anti-spam checks.' }, { status: 400 });
  }

  const name = sanitize(formData.get('name'));
  const email = sanitize(formData.get('email')).toLowerCase();
  const phone = sanitize(formData.get('phone'));
  const positionAppliedFor = sanitize(formData.get('positionAppliedFor'));
  const submissionPage = sanitize(formData.get('submissionPage')) || 'Careers Application';
  const submittedAt = sanitize(formData.get('submittedAt')) || new Date().toISOString();
  const pageUrl = sanitize(formData.get('pageUrl'));
  const userAgent = sanitize(formData.get('userAgent'));

  if (!name || !email || !phone || !positionAppliedFor) {
    return NextResponse.json({ message: 'Name, email, phone, and position are required.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: 'Please provide a valid email address.' }, { status: 400 });
  }

  const attachmentEntry = formData.get('attachment');
  if (!(attachmentEntry instanceof File)) {
    return NextResponse.json({ message: 'Please attach your application file.' }, { status: 400 });
  }

  if (attachmentEntry.size <= 0) {
    return NextResponse.json({ message: 'Attached file is empty.' }, { status: 400 });
  }

  if (attachmentEntry.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json(
      { message: 'Attachment is too large. Maximum file size is 10MB.' },
      { status: 400 },
    );
  }

  const attachmentBuffer = await attachmentEntry.arrayBuffer();

  const htmlContent = `
    <h2>New Careers Application</h2>
    <p>A new career application was submitted on the website.</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Position Applied For:</strong> ${positionAppliedFor}</li>
      <li><strong>Submission Page:</strong> ${submissionPage}</li>
      <li><strong>Submitted At:</strong> ${submittedAt}</li>
      <li><strong>Page URL:</strong> ${pageUrl || 'Not provided'}</li>
      <li><strong>User Agent:</strong> ${userAgent || 'Not provided'}</li>
      <li><strong>Attachment:</strong> ${attachmentEntry.name} (${Math.round(attachmentEntry.size / 1024)} KB)</li>
    </ul>
  `;

  const textContent = [
    'New Careers Application',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Position Applied For: ${positionAppliedFor}`,
    `Submission Page: ${submissionPage}`,
    `Submitted At: ${submittedAt}`,
    `Page URL: ${pageUrl || 'Not provided'}`,
    `User Agent: ${userAgent || 'Not provided'}`,
    `Attachment: ${attachmentEntry.name} (${Math.round(attachmentEntry.size / 1024)} KB)`,
  ].join('\n');

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
      subject: `Careers Application: ${positionAppliedFor} (${name})`,
      htmlContent,
      textContent,
      attachment: [
        {
          name: attachmentEntry.name,
          content: toBase64(attachmentBuffer),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unable to read Brevo error payload.');
    return NextResponse.json(
      { message: `Could not send application email (${response.status}). ${errorBody}` },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message:
      'Thank you for contacting Moderate Business Systems Ltd. Your submission has been received successfully. Our team will review it and get back to you as soon as possible.',
  });
}
