import { NextResponse } from 'next/server';
import { createAdminSessionToken, getAdminCredentials, setAdminSessionCookie } from '../../../../../lib/admin-auth';
import { checkAdminAccess, getClientIp } from '../../../../../lib/admin-security';
import { checkRateLimit, clearRateLimitFailures, recordRateLimitFailure } from '../../../../../lib/rate-limit';

export async function POST(request: Request) {
  try {
    const access = checkAdminAccess(request, false);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;

    const rateKey = `admin-login:${getClientIp(request)}:${body?.username || 'unknown'}`;
    const limit = checkRateLimit(rateKey);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again later.', retryAfterSeconds: limit.retryAfterSeconds },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      );
    }

    if (!body?.username || !body?.password) {
      recordRateLimitFailure(rateKey);
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    const creds = getAdminCredentials();
    if (!creds.password) {
      return NextResponse.json({ message: 'Admin password is not configured.' }, { status: 503 });
    }

    if (body.username !== creds.username || body.password !== creds.password) {
      recordRateLimitFailure(rateKey);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = createAdminSessionToken(body.username);
    setAdminSessionCookie(token);
    clearRateLimitFailures(rateKey);
    return NextResponse.json({ message: 'Authenticated.' });
  } catch (error) {
    console.error('Admin login route failed:', error);
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ message: `Admin login failed: ${message}` }, { status: 500 });
  }
}
