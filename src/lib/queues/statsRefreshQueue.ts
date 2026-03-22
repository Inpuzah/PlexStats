import { Queue } from 'bullmq';

function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  return {
    url: redisUrl
  };
}

let queue: Queue | null = null;

function getStatsRefreshQueue() {
  const connection = getRedisConnection();

  if (!connection) {
    return null;
  }

  if (!queue) {
    queue = new Queue('stats-refresh', {
      connection
    });
  }

  return queue;
}

export async function enqueueStatsRefresh(username: string) {
  const statsRefreshQueue = getStatsRefreshQueue();

  if (!statsRefreshQueue) {
    return null;
  }

  return statsRefreshQueue.add(
    'refresh-player',
    { username },
    {
      removeOnComplete: 100,
      removeOnFail: 100
    }
  );
}
