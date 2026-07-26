import { NextResponse } from 'next/server';
import { getAdminSessionInfo } from '../../../../../lib/admin-auth';
import { checkAdminAccess } from '../../../../../lib/admin-security';

export async function GET(request: Request) {
  const access = checkAdminAccess(request, false);
  if (!access.ok) {
    return NextResponse.json({ message: access.message, authenticated: false }, { status: access.status });
  }

  const info = getAdminSessionInfo();
  return NextResponse.json(
    {
      ...info,
      warningThresholdSeconds: 15 * 60,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
