import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient;

const initRedis = async () => {
  if (!redisClient) {
    //console.log('🔄 Initializing Redis client...')
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
      throw new Error('Redis configuration is missing. Please set REDIS_HOST, REDIS_PORT, and REDIS_PASSWORD in your environment variables.');
    }
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        // Bound the initial connection so an unreachable/firewalled Redis host
        // fails fast (10s) instead of leaving requests pending forever.
        connectTimeout: 10000,
        reconnectStrategy: (retries) => Math.min(retries * 1000, 5000),
      },
      password: process.env.REDIS_PASSWORD,
      disableOfflineQueue: true,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    await redisClient.connect();
    //console.log('✅ Redis connected');
  }

  return redisClient;
};

export { initRedis, redisClient };
