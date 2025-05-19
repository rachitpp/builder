import { createClient } from "redis";
import { logger } from "../utils/logger";

const redisClient = createClient({
  url: "redis://default:6vZLMldS4PHS0t3JWxpjubvDQjupe8xE@redis-19270.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:19270",
});

// Connect to Redis
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info("Redis connected successfully");
  } catch (error: any) {
    logger.error(`Redis connection error: ${error.message}`);
    // Try to reconnect after 5 seconds
    setTimeout(connectRedis, 5000);
  }
};

// Handle Redis errors to prevent app from crashing
redisClient.on("error", (err) => {
  logger.error(`Redis error: ${err.message}`);
});

export { redisClient, connectRedis };
