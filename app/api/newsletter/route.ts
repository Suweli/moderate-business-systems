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

function getBrevoConfig() {
  // Add these values to `.env.local` using the keys shown in `.env.example`.
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_NEWSLETTER_LIST_ID;

  if (!apiKey || !listId) {
    return null;
  }

  return {
    apiKey,
    listId: Number(listId),
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

  if (!config || Number.isNaN(config.listId)) {
    return NextResponse.json(
      {
        message: 'Newsletter subscriptions are not fully configured yet. Add BREVO_API_KEY and BREVO_NEWSLETTER_LIST_ID to .env.local.',
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