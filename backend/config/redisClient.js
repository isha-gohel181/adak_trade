import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let rawClient = null;
let connectPromise = null;
let authFailed = false;
let lastErrorLogTime = 0;

const logThrottledWarning = (msg) => {
  const now = Date.now();
  if (now - lastErrorLogTime > 15000) { // Log at most once per 15s to prevent log spam
    console.warn(`⚠️ [REDIS FALLBACK] ${msg}`);
    lastErrorLogTime = now;
  }
};

// Safe default fallback return values for common Redis commands
const getFallbackValue = (prop) => {
  switch (prop) {
    case 'get':
    case 'hGet':
      return null;
    case 'mGet':
    case 'keys':
    case 'zRange':
    case 'zRangeByScore':
    case 'sMembers':
    case 'hKeys':
    case 'lRange':
      return [];
    case 'hGetAll':
      return {};
    case 'exists':
      return 0;
    case 'ttl':
      return -2;
    case 'set':
    case 'setEx':
    case 'mSet':
      return 'OK';
    case 'del':
    case 'hDel':
    case 'sRem':
    case 'zRem':
    case 'zRemRangeByScore':
    case 'zAdd':
    case 'sAdd':
    case 'hSet':
    case 'rPush':
    case 'lPush':
    case 'expire':
    case 'persist':
      return 1;
    default:
      return null;
  }
};

// Resilient proxy so that any Redis call throughout the backend never crashes when Redis is offline or auth fails
const redisProxy = new Proxy({}, {
  get(target, prop) {
    // Crucial: ensure the proxy is not treated as a thenable Promise by JavaScript await
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return undefined;
    }
    if (typeof prop === 'symbol') {
      return target[prop];
    }
    if (prop === 'isOpen') {
      return Boolean(rawClient && rawClient.isOpen && !authFailed);
    }
    if (prop === 'isReady') {
      return Boolean(rawClient && rawClient.isReady && !authFailed);
    }
    if (prop === 'rawClient') {
      return rawClient;
    }
    if (prop === 'on' || prop === 'once' || prop === 'off') {
      return (event, handler) => {
        if (rawClient) {
          try { rawClient[prop](event, handler); } catch (_) {}
        }
        return redisProxy;
      };
    }
    if (prop === 'quit' || prop === 'disconnect') {
      return async () => {
        if (rawClient && rawClient.isOpen) {
          try { await rawClient.disconnect(); } catch (_) {}
        }
        rawClient = null;
        connectPromise = null;
      };
    }

    // Command wrapper
    return async (...args) => {
      if (rawClient && rawClient.isOpen && rawClient.isReady && !authFailed) {
        try {
          return await rawClient[prop](...args);
        } catch (err) {
          logThrottledWarning(`Redis operation '${String(prop)}' failed (${err.message}). Using fallback.`);
          return getFallbackValue(prop);
        }
      }
      return getFallbackValue(prop);
    };
  }
});

const initRedis = async () => {
  // If already connected and ready, return proxy immediately
  if (rawClient && rawClient.isOpen && rawClient.isReady && !authFailed) {
    return redisProxy;
  }

  // If auth has failed permanently (e.g. WRONGPASS), do not keep hammering the server
  if (authFailed) {
    logThrottledWarning('Redis authentication failed (WRONGPASS). Continuing in fallback mode.');
    return redisProxy;
  }

  // If connection is already in progress, wait for it
  if (connectPromise) {
    try {
      await connectPromise;
      return redisProxy;
    } catch (_) {
      return redisProxy;
    }
  }

  // Check if configuration exists
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
    logThrottledWarning('Redis configuration is missing in environment. Using in-memory fallback.');
    return redisProxy;
  }

  // Attempt connection with bounded timeout
  connectPromise = (async () => {
    try {
      if (rawClient) {
        try { await rawClient.disconnect(); } catch (_) {}
        rawClient = null;
      }

      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          connectTimeout: 3000,
          reconnectStrategy: (retries, cause) => {
            if (cause && cause.message && cause.message.includes('WRONGPASS')) {
              authFailed = true;
              return new Error('Redis authentication failed: WRONGPASS');
            }
            if (retries >= 3) {
              return new Error('Max Redis reconnect attempts reached');
            }
            return Math.min(retries * 1000, 3000);
          },
        },
        password: process.env.REDIS_PASSWORD,
        disableOfflineQueue: true,
      });

      client.on('error', (err) => {
        if (err.message && err.message.includes('WRONGPASS')) {
          authFailed = true;
        }
        logThrottledWarning(`Redis error: ${err.message}`);
      });

      rawClient = client;
      await client.connect();
      authFailed = false;
      console.log('✅ Redis connected successfully');
    } catch (err) {
      if (err.message && err.message.includes('WRONGPASS')) {
        authFailed = true;
      }
      logThrottledWarning(`Could not connect to Redis: ${err.message}. Running in fallback mode.`);
    } finally {
      connectPromise = null;
    }
  })();

  await connectPromise;
  return redisProxy;
};

export { initRedis, redisProxy as redisClient };

