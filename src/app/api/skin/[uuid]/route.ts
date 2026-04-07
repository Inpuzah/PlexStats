import { NextResponse } from 'next/server';

const SKIN_TIMEOUT_MS = 10000;

function normalizeUuid(rawUuid: string): string {
  return rawUuid.replaceAll('-', '').trim();
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
      cache: 'no-store'
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const params = await context.params;
  const uuid = normalizeUuid(params.uuid);

  if (!/^[0-9a-fA-F]{32}$/.test(uuid)) {
    return NextResponse.json({ error: 'Invalid UUID.' }, { status: 400 });
  }

  const url = new URL(request.url);
  const profileSkinUrl = url.searchParams.get('skinUrl')?.trim();

  const candidates = [
    profileSkinUrl,
    `https://mc-heads.net/skin/${encodeURIComponent(uuid)}`,
    `https://crafatar.com/skins/${encodeURIComponent(uuid)}?overlay=true&default=MHF_Steve`
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    try {
      const response = await fetchWithTimeout(candidate, SKIN_TIMEOUT_MS);

      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const body = await response.arrayBuffer();

      return new NextResponse(body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=300, s-maxage=300'
        }
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: 'Unable to retrieve skin image.' }, { status: 502 });
}
