import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.log(`Redis connection failed after ${times} retries`);
      return null; 
    }
    return Math.min(times * 100, 2000);
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('🔴 Redis connected');
});

redis.on('error', (error) => {
  console.error('🔴 Redis error:', error);
});

export default redis;