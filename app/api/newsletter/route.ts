import { NextResponse } from 'next/server';

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterPayload = {
  email?: string;
  honey?: string;
  startedAt?: number;
  pageUrl?: string;
  userAgent?: string;
};

type EnvReadResult = {
  value: string | null;
  resolvedName: string | null;
};

type BrevoConfigResult =
  | {
      ok: true;
      apiKey: string;
      listId: number;
      apiKeyVar: string;
      listIdVar: string;
    }
  | {
      ok: false;
      reason: 'missing_api_key' | 'missing_list_id' | 'invalid_list_id';
      listIdRaw: string | null;
      attemptedApiKeyVars: string[];
      attemptedListIdVars: string[];
      resolvedApiKeyVar: string | null;
      resolvedListIdVar: string | null;
    };

function readEnvValue(name: string) {
  const raw = process.env[name];
  if (!raw) {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  // Vercel env values are raw strings; tolerate accidental wrapping quotes.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || null;
  }

  return trimmed;
}

function readFirstEnvValue(names: string[]): EnvReadResult {
  for (const name of names) {
    const value = readEnvValue(name);
    if (value) {
      return {
        value,
        resolvedName: name,
      };
    }
  }

  return {
    value: null,
    resolvedName: null,
  };
}

function getBrevoConfig(): BrevoConfigResult {
  const apiKeyVars = ['BREVO_API_KEY', 'BREVO_API_V3_KEY', 'SIB_API_KEY'];
  const listIdVars = ['BREVO_NEWSLETTER_LIST_ID', 'BREVO_LIST_ID', 'BREVO_CONTACT_LIST_ID'];

  // Add these values to `.env.local` using the keys shown in `.env.example`.
  const apiKeyRead = readFirstEnvValue(apiKeyVars);
  const listIdRead = readFirstEnvValue(listIdVars);

  const apiKey = apiKeyRead.value;
  const listIdRaw = listIdRead.value;

  if (!apiKey || !listIdRaw) {
    return {
      ok: false,
      reason: !apiKey ? 'missing_api_key' : 'missing_list_id',
      listIdRaw,
      attemptedApiKeyVars: apiKeyVars,
      attemptedListIdVars: listIdVars,
      resolvedApiKeyVar: apiKeyRead.resolvedName,
      resolvedListIdVar: listIdRead.resolvedName,
    };
  }

  const listId = Number(listIdRaw);
  if (!Number.isInteger(listId) || listId <= 0) {
    return {
      ok: false,
      reason: 'invalid_list_id',
      listIdRaw,
      attemptedApiKeyVars: apiKeyVars,
      attemptedListIdVars: listIdVars,
      resolvedApiKeyVar: apiKeyRead.resolvedName,
      resolvedListIdVar: listIdRead.resolvedName,
    };
  }

  return {
    ok: true,
    apiKey,
    listId,
    apiKeyVar: apiKeyRead.resolvedName || 'BREVO_API_KEY',
    listIdVar: listIdRead.resolvedName || 'BREVO_NEWSLETTER_LIST_ID',
  };
}

async function brevoRequest<T>(path: string, init: RequestInit, apiKey: string): Promise<T> {
  const response = await fetch(`${BREVO_API_BASE}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw {
      status: response.status,
      payload: errorPayload,
    };
  }

  return response.json().catch(() => ({}) as T);
}

export async function POST(request: Request) {
  const config = getBrevoConfig();

  if (!config.ok) {
    const details =
      config.reason === 'missing_api_key'
        ? `Missing API key. Checked: ${config.attemptedApiKeyVars.join(', ')}.`
        : config.reason === 'missing_list_id'
          ? `Missing list ID. Checked: ${config.attemptedListIdVars.join(', ')}.`
          : `Invalid list ID value "${config.listIdRaw}" from ${config.resolvedListIdVar || 'unknown variable'}. Use a positive integer like 12.`;

    return NextResponse.json(
      {
        message:
          `Newsletter subscriptions are not fully configured yet. ${details} Add BREVO_API_KEY and BREVO_NEWSLETTER_LIST_ID to your environment (.env.local for local development or Vercel Project Settings in production).`,
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as NewsletterPayload | null;

  if (!body) {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Spam protection: reject hidden honeypot hits and unrealistically fast submissions.
  if (body.honey) {
    return NextResponse.json({ message: 'Subscription could not be completed.' }, { status: 400 });
  }

  if (!body.startedAt || Date.now() - body.startedAt < 1500) {
    return NextResponse.json({ message: 'Please wait a moment and try again.' }, { status: 429 });
  }

  try {
    await brevoRequest(`/contacts/${encodeURIComponent(email)}`, { method: 'GET' }, config.apiKey);

    return NextResponse.json(
      {
        message: 'This email address is already subscribed to the Moderate Business Systems Ltd newsletter.',
      },
      { status: 409 }
    );
  } catch (error) {
    const status = typeof error === 'object' && error && 'status' in error ? (error as { status: number }).status : 500;

    if (status !== 404) {
      return NextResponse.json(
        { message: 'We could not verify your subscription right now. Please try again shortly.' },
        { status: 502 }
      );
    }
  }

  try {
    await brevoRequest(
      '/contacts',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          listIds: [config.listId],
          updateEnabled: false,
        }),
      },
      config.apiKey
    );

    return NextResponse.json({
      message:
        "Thank you for subscribing to the Moderate Business Systems Ltd newsletter. You'll receive updates on our services, company news, industry insights, and career opportunities.",
    });
  } catch {
    return NextResponse.json(
      { message: 'We could not complete your subscription right now. Please try again shortly.' },
      { status: 502 }
    );
  }
}