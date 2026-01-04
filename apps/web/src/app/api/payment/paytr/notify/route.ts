import { NextResponse } from 'next/server';
import { env } from '@/lib/config';

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  let body: string;

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData();
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.set(key, String(value));
    });
    body = params.toString();
  } else {
    const json = await req.json().catch(() => ({}));
    body = JSON.stringify(json);
  }

  const response = await fetch(`${env.apiUrl}/payments/paytr/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType.includes('application/x-www-form-urlencoded')
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    },
    body,
    cache: 'no-store',
  });

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
