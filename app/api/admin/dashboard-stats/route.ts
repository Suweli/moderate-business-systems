import { NextResponse } from 'next/server';
import { checkAdminAccess } from '../../../../lib/admin-security';
import { readApprovedTestimonialsPage } from '../../../../lib/testimonials-db';

export async function GET(request: Request) {
  const access = checkAdminAccess(request, true);
  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  const payload = await readApprovedTestimonialsPage(1, 6);
  return NextResponse.json(payload.stats, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
