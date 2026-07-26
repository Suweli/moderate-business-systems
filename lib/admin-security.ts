import { isAdminAuthenticated } from './admin-auth';

function normalizeIp(ip: string) {
  return ip.trim().toLowerCase();
}

export function getClientIp(request: Request) {
  const xff = request.headers.get('x-forwarded-for') || '';
  const firstForwarded = xff.split(',')[0]?.trim();
  if (firstForwarded) return firstForwarded;

  const xri = request.headers.get('x-real-ip') || '';
  if (xri.trim()) return xri.trim();

  return 'unknown';
}

export function isIpAllowed(request: Request) {
  const allowedRaw = process.env.ADMIN_ALLOWED_IPS || '';
  if (!allowedRaw.trim()) {
    return true;
  }

  const allowed = allowedRaw
    .split(',')
    .map((item) => normalizeIp(item))
    .filter(Boolean);

  if (!allowed.length) return true;

  const ip = normalizeIp(getClientIp(request));
  return allowed.includes(ip);
}

export function checkAdminAccess(request: Request, requireAuth = true) {
  if (!isIpAllowed(request)) {
    return { ok: false, status: 403, message: 'Access denied for this IP address.' };
  }

  if (requireAuth && !isAdminAuthenticated()) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }

  return { ok: true, status: 200, message: 'ok' };
}
