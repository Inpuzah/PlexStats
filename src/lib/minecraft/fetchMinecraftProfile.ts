export type MinecraftProfile = {
  username: string;
  uuid: string;
  skinUrl: string;
  capeUrl: string | null;
};

type MojangUserResponse = {
  id: string;
  name: string;
};

type MojangSessionResponse = {
  properties?: Array<{
    name: string;
    value: string;
  }>;
};

type DecodedTextures = {
  textures?: {
    SKIN?: { url?: string };
    CAPE?: { url?: string };
  };
};

const REQUEST_TIMEOUT_MS = 7000;
const DEBUG_LOOKUP = process.env.NODE_ENV !== 'production';

function debugLog(message: string, details?: Record<string, unknown>) {
  if (!DEBUG_LOOKUP) {
    return;
  }

  if (details) {
    console.info('[minecraft-profile]', message, details);
    return;
  }

  console.info('[minecraft-profile]', message);
}

function ensureHttps(url: string | undefined): string | undefined {
  if (!url) {
    return url;
  }

  if (url.startsWith('http://')) {
    return `https://${url.slice('http://'.length)}`;
  }

  return url;
}

function formatUuid(rawUuid: string): string {
  if (rawUuid.length !== 32) {
    return rawUuid;
  }

  return [
    rawUuid.slice(0, 8),
    rawUuid.slice(8, 12),
    rawUuid.slice(12, 16),
    rawUuid.slice(16, 20),
    rawUuid.slice(20)
  ].join('-');
}

function parseTextures(properties: MojangSessionResponse['properties']): {
  skinUrl: string | null;
  capeUrl: string | null;
} {
  const texturesProperty = properties?.find((entry) => entry.name === 'textures');

  if (!texturesProperty?.value) {
    throw new Error('Missing textures data for player profile.');
  }

  const decoded = JSON.parse(Buffer.from(texturesProperty.value, 'base64').toString('utf8')) as DecodedTextures;
  const skinUrl = ensureHttps(decoded.textures?.SKIN?.url) ?? null;
  const capeUrl = ensureHttps(decoded.textures?.CAPE?.url) ?? null;

  return { skinUrl, capeUrl };
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    debugLog('request completed', {
      url,
      status: response.status,
      durationMs: Date.now() - startedAt
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    debugLog('request failed', {
      url,
      error: message,
      durationMs: Date.now() - startedAt
    });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchMinecraftProfile(username: string): Promise<MinecraftProfile> {
  const normalized = username.trim();
  const startedAt = Date.now();

  debugLog('lookup started', { username: normalized });

  if (!normalized) {
    throw new Error('Username is required.');
  }

  const userResponse = await fetchWithTimeout(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(normalized)}`
  );

  if (userResponse.status === 404 || userResponse.status === 204) {
    debugLog('player not found', { username: normalized, status: userResponse.status });
    throw new Error('PLAYER_NOT_FOUND');
  }

  if (!userResponse.ok) {
    debugLog('mojang lookup failed', { username: normalized, status: userResponse.status });
    throw new Error('MOJANG_LOOKUP_FAILED');
  }

  const userData = (await userResponse.json()) as MojangUserResponse;
  const uuid = userData.id;

  let skinUrl: string | null = null;
  let capeUrl: string | null = null;

  try {
    const sessionResponse = await fetchWithTimeout(
      `https://sessionserver.mojang.com/session/minecraft/profile/${encodeURIComponent(uuid)}`
    );

    if (sessionResponse.ok) {
      const sessionData = (await sessionResponse.json()) as MojangSessionResponse;
      const textures = parseTextures(sessionData.properties);
      skinUrl = textures.skinUrl;
      capeUrl = textures.capeUrl;
    }
  } catch {
    // Cape data is optional and should not block profile loading.
    debugLog('cape lookup failed, continuing without cape', { username: normalized });
  }

  // Fallback skin source if session textures are unavailable.
  if (!skinUrl) {
    skinUrl = `https://crafatar.com/skins/${encodeURIComponent(uuid)}?overlay=true&default=MHF_Steve`;
    debugLog('using fallback skin URL', { username: normalized, skinUrl });
  }

  debugLog('lookup succeeded', {
    username: userData.name,
    uuid: formatUuid(uuid),
    durationMs: Date.now() - startedAt
  });

  return {
    username: userData.name,
    uuid: formatUuid(uuid),
    skinUrl,
    capeUrl
  };
}
