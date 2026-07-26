type AttemptState = {
  timestamps: number[];
  blockedUntil: number;
};

const attempts = new Map<string, AttemptState>();

function getWindowSeconds() {
  const fromEnv = Number(process.env.ADMIN_LOGIN_WINDOW_SECONDS || '900');
  return Number.isFinite(fromEnv) && fromEnv > 0 ? Math.trunc(fromEnv) : 900;
}

function getMaxAttempts() {
  const fromEnv = Number(process.env.ADMIN_MAX_LOGIN_ATTEMPTS || '8');
  return Number.isFinite(fromEnv) && fromEnv > 0 ? Math.trunc(fromEnv) : 8;
}

export function checkRateLimit(key: string) {
  const now = Date.now();
  const windowMs = getWindowSeconds() * 1000;
  const maxAttempts = getMaxAttempts();

  const state = attempts.get(key) || { timestamps: [], blockedUntil: 0 };

  if (state.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((state.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  state.timestamps = state.timestamps.filter((ts) => now - ts <= windowMs);

  const remaining = Math.max(0, maxAttempts - state.timestamps.length);
  return { allowed: remaining > 0, retryAfterSeconds: 0, remaining };
}

export function recordRateLimitFailure(key: string) {
  const now = Date.now();
  const windowMs = getWindowSeconds() * 1000;
  const maxAttempts = getMaxAttempts();

  const state = attempts.get(key) || { timestamps: [], blockedUntil: 0 };
  state.timestamps = state.timestamps.filter((ts) => now - ts <= windowMs);
  state.timestamps.push(now);

  if (state.timestamps.length >= maxAttempts) {
    state.blockedUntil = now + windowMs;
    state.timestamps = [];
  }

  attempts.set(key, state);
}

export function clearRateLimitFailures(key: string) {
  attempts.delete(key);
}
