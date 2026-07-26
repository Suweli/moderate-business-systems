import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '../../../../../lib/admin-auth';
import { checkAdminAccess } from '../../../../../lib/admin-security';

export async function POST(request: Request) {
  const access = checkAdminAccess(request, false);
  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  clearAdminSessionCookie();
  return NextResponse.json({ message: 'Logged out.' });
}
