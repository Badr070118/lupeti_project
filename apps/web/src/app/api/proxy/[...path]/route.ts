import { NextRequest, NextResponse } from 'next/server';

const targetBase =
  process.env.API_INTERNAL_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const safePath = Array.isArray(path) ? path : [];
  const joinedPath = safePath.join('/');
  const query = req.nextUrl.search;
  const targetUrl = `${targetBase}/${joinedPath}${query}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.arrayBuffer();

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  // Avoid double-decoding issues when the upstream response is already decompressed.
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
