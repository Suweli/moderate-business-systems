import { NextResponse } from 'next/server';

function htmlResponse(title: string, message: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 32px; }
      .card { max-width: 640px; margin: 0 auto; background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 24px; }
      h1 { margin-top: 0; color: #93c5fd; }
      a { color: #60a5fa; }
      p { line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${message}</p>
      <p><a href="/testimonials">Return to Testimonials</a></p>
    </div>
  </body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function GET(request: Request) {
  return htmlResponse('Use the Admin Dashboard', 'Sign in to the administrator dashboard to review testimonials.', 405);
}
