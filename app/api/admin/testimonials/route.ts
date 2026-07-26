import { NextResponse } from 'next/server';
import { checkAdminAccess } from '../../../../lib/admin-security';
import { deleteTestimonialById, listTestimonialsByStatus, updateTestimonialById, type TestimonialStatus } from '../../../../lib/testimonials-db';

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

function isServerlessProduction() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

function requiresPersistentDatabase() {
  return isServerlessProduction() && !hasDatabaseUrl();
}

function sanitize(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export async function GET(request: Request) {
  const access = checkAdminAccess(request, true);
  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') || 'all') as TestimonialStatus | 'all';
  const normalized = ['all', 'pending', 'approved', 'rejected'].includes(status) ? status : 'all';

  const items = await listTestimonialsByStatus(normalized);
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function PATCH(request: Request) {
  const access = checkAdminAccess(request, true);
  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  if (requiresPersistentDatabase()) {
    return NextResponse.json(
      {
        message:
          'Admin testimonial edits are temporarily unavailable because persistent storage is not configured. Please set DATABASE_URL and redeploy.',
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    id?: number;
    name?: string;
    jobTitle?: string;
    company?: string;
    industry?: string;
    email?: string;
    testimonial?: string;
    rating?: number;
    status?: TestimonialStatus;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ message: 'Testimonial id is required.' }, { status: 400 });
  }

  if (body.rating !== undefined && (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5)) {
    return NextResponse.json({ message: 'Rating must be an integer between 1 and 5.' }, { status: 400 });
  }

  const updated = await updateTestimonialById(body.id, {
    name: body.name !== undefined ? sanitize(body.name) : undefined,
    jobTitle: body.jobTitle !== undefined ? sanitize(body.jobTitle) : undefined,
    company: body.company !== undefined ? sanitize(body.company) : undefined,
    industry: body.industry !== undefined ? sanitize(body.industry) : undefined,
    email: body.email !== undefined ? sanitize(body.email.toLowerCase()) : undefined,
    testimonial: body.testimonial !== undefined ? sanitize(body.testimonial) : undefined,
    rating: body.rating,
    status: body.status,
  }).catch((error) => {
    console.error('Failed to update testimonial from admin API:', error);
    return null;
  });

  if (!updated) {
    return NextResponse.json({ message: 'Could not update testimonial at this time.' }, { status: 503 });
  }

  return NextResponse.json({ message: 'Testimonial updated.', item: updated });
}

export async function DELETE(request: Request) {
  const access = checkAdminAccess(request, true);
  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  if (requiresPersistentDatabase()) {
    return NextResponse.json(
      {
        message:
          'Admin testimonial deletion is temporarily unavailable because persistent storage is not configured. Please set DATABASE_URL and redeploy.',
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { id?: number } | null;
  if (!body?.id) {
    return NextResponse.json({ message: 'Testimonial id is required.' }, { status: 400 });
  }

  const deleted = await deleteTestimonialById(body.id).catch((error) => {
    console.error('Failed to delete testimonial from admin API:', error);
    return false;
  });
  if (!deleted) {
    return NextResponse.json({ message: 'Could not delete testimonial at this time.' }, { status: 503 });
  }

  return NextResponse.json({ message: 'Testimonial deleted.' });
}
