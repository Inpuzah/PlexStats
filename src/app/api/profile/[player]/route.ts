import { NextResponse } from 'next/server';
import { fetchMinecraftProfile } from '@/lib/minecraft/fetchMinecraftProfile';

const DEBUG_PROFILE_ROUTE = process.env.NODE_ENV !== 'production';

function routeLog(message: string, details?: Record<string, unknown>) {
  if (!DEBUG_PROFILE_ROUTE) {
    return;
  }

  if (details) {
    console.info('[api/profile]', message, details);
    return;
  }

  console.info('[api/profile]', message);
}

export async function GET(_: Request, context: { params: Promise<{ player: string }> }) {
  const { player } = await context.params;
  const username = player.trim();

  routeLog('request received', { username });

  if (!username) {
    routeLog('request rejected - missing username');
    return NextResponse.json({ error: 'Player username is required.' }, { status: 400 });
  }

  try {
    const profile = await fetchMinecraftProfile(username);

    routeLog('request succeeded', { username: profile.username, uuid: profile.uuid });

    return NextResponse.json({
      source: 'mojang',
      data: profile
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';

    routeLog('request failed', { username, error: message });

    if (message === 'PLAYER_NOT_FOUND') {
      return NextResponse.json({ error: 'Minecraft player not found.' }, { status: 404 });
    }

    if (message === 'Username is required.') {
      return NextResponse.json({ error: 'Player username is required.' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Unable to reach Mojang profile services right now. Please try again shortly.'
      },
      { status: 503 }
    );
  }
}
