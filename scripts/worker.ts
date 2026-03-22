import { Worker } from 'bullmq';
import { prisma } from '@/lib/db';
import { fetchPlayerStats } from '@/lib/stats/fetchPlayerStats';

function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error('REDIS_URL is not configured.');
  }

  return {
    url: redisUrl
  };
}

new Worker(
  'stats-refresh',
  async (job) => {
    const { username } = job.data as { username: string };

    const stats = await fetchPlayerStats(username);

    const player = await prisma.player.upsert({
      where: { username: stats.username },
      update: {},
      create: { username: stats.username }
    });

    await prisma.statSnapshot.create({
      data: {
        playerId: player.id,
        wins: stats.wins,
        losses: stats.losses,
        kills: stats.kills,
        deaths: stats.deaths,
        gamesPlayed: stats.gamesPlayed,
        calculatedScore: stats.calculatedScore
      }
    });
  },
  {
    connection: getRedisConnection()
  }
);

console.log('Stats refresh worker is running.');
