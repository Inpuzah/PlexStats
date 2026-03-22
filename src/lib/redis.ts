import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });

  return redisClient;
}
