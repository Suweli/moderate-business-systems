import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'mbs_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.ADMIN_AUTH_SECRET || process.env.TESTIMONIAL_MODERATION_KEY || '';
}

function signPayload(payload: string) {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error('ADMIN_AUTH_SECRET is not configured.');
  }
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function createAdminSessionToken(username: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${username}:${exp}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}:${signature}`, 'utf8').toString('base64url');
}

type TokenPayload = {
  username: string;
  exp: number;
  signature: string;
};

function parseAdminSessionToken(token: string | undefined | null): TokenPayload | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [username, expRaw, signature] = decoded.split(':');
    const exp = Number(expRaw);

    if (!username || !signature || !Number.isFinite(exp)) {
      return null;
    }

    return {
      username,
      exp,
      signature,
    };
  } catch {
    return null;
  }
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  const parsed = parseAdminSessionToken(token);
  if (!parsed) return false;

  try {
    if (parsed.exp < Math.floor(Date.now() / 1000)) return false;

    const payload = `${parsed.username}:${parsed.exp}`;
    const expected = signPayload(payload);
    return crypto.timingSafeEqual(Buffer.from(parsed.signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || '',
  };
}

export function setAdminSessionCookie(token: string) {
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminSessionCookie() {
  cookies().set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function isAdminAuthenticated() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionInfo() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const parsed = parseAdminSessionToken(token);

  if (!parsed || !verifyAdminSessionToken(token)) {
    return {
      authenticated: false,
      username: null as string | null,
      expiresAt: null as string | null,
      secondsRemaining: 0,
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const secondsRemaining = Math.max(0, parsed.exp - now);

  return {
    authenticated: true,
    username: parsed.username,
    expiresAt: new Date(parsed.exp * 1000).toISOString(),
    secondsRemaining,
  };
}
