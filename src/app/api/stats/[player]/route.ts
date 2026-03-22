import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { enqueueStatsRefresh } from '@/lib/queues/statsRefreshQueue';
import { getRedisClient } from '@/lib/redis';
import { fetchPlayerStats } from '@/lib/stats/fetchPlayerStats';

const CACHE_TTL_SECONDS = 60;

export async function GET(_: Request, context: { params: Promise<{ player: string }> }) {
  const { player } = await context.params;
  const username = player.trim();

  if (!username) {
    return NextResponse.json({ error: 'Player username is required.' }, { status: 400 });
  }

  const cacheKey = `stats:${username.toLowerCase()}`;
  const redis = getRedisClient();

  try {
    const cached = redis ? await redis.get(cacheKey) : null;

    if (cached) {
      return NextResponse.json({ source: 'cache', data: JSON.parse(cached) });
    }
  } catch {
    // Continue without cache if Redis is unavailable.
  }

  const stats = await fetchPlayerStats(username);

  try {
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(stats), 'EX', CACHE_TTL_SECONDS);
    }
  } catch {
    // Ignore cache writes in failure scenarios.
  }

  try {
    const playerRecord = await prisma.player.upsert({
      where: { username: stats.username },
      update: {},
      create: { username: stats.username }
    });

    await prisma.statSnapshot.create({
      data: {
        playerId: playerRecord.id,
        wins: stats.wins,
        losses: stats.losses,
        kills: stats.kills,
        deaths: stats.deaths,
        gamesPlayed: stats.gamesPlayed,
        calculatedScore: stats.calculatedScore
      }
    });
  } catch {
    // Continue without persistence when DB is unavailable.
  }

  try {
    await enqueueStatsRefresh(stats.username);
  } catch {
    // Queue is optional for request path.
  }

  return NextResponse.json({ source: 'live', data: stats });
}
