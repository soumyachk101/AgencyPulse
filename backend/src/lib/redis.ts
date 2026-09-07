import Redis from "ioredis";
import { logger } from "../monitoring/logger";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
 maxRetriesPerRequest: null, // Required for BullMQ
 enableReadyCheck: false,
 retryStrategy: (times) => {
 const delay = Math.min(times * 50, 2000);
 logger.warn(
 { times, delay },
 "Redis connection retry"
 );
 return delay;
 },
});

redis.on("connect", () => {
 logger.info("Redis client connected");
});

redis.on("ready", () => {
 logger.info("Redis client ready");
});

redis.on("error", (err) => {
 logger.error(err, "Redis connection error");
});

redis.on("close", () => {
 logger.warn("Redis connection closed");
});

export default redis;
