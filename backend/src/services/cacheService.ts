import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

/**
 * Cache service for Redis operations
 */
export class CacheService {
  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache (will be JSON stringified)
   * @param expirationInSeconds Expiration time in seconds (default: 1 hour)
   */
  static async set(
    key: string,
    value: any,
    expirationInSeconds = 3600
  ): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.set(key, stringValue, { EX: expirationInSeconds });
      logger.debug(`Cache set: ${key}`);
    } catch (error: any) {
      logger.error(`Cache set error: ${error.message}`);
    }
  }

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (!value) return null;
      logger.debug(`Cache hit: ${key}`);
      return JSON.parse(value) as T;
    } catch (error: any) {
      logger.error(`Cache get error: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete a value from the cache
   * @param key The cache key
   */
  static async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug(`Cache deleted: ${key}`);
    } catch (error: any) {
      logger.error(`Cache delete error: ${error.message}`);
    }
  }

  /**
   * Delete multiple values from the cache using a pattern
   * @param pattern The pattern to match keys (e.g., "user:*")
   */
  static async delByPattern(pattern: string): Promise<void> {
    try {
      // Convert numeric cursor to string for Redis
      let cursor = "0";
      do {
        const reply = await redisClient.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = reply.cursor.toString();

        if (reply.keys.length > 0) {
          await redisClient.del(reply.keys);
          logger.debug(
            `Cache deleted by pattern: ${pattern}, keys: ${reply.keys.length}`
          );
        }
      } while (cursor !== "0");
    } catch (error: any) {
      logger.error(`Cache delete by pattern error: ${error.message}`);
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<void> {
    try {
      await redisClient.flushAll();
      logger.info("Cache cleared");
    } catch (error: any) {
      logger.error(`Cache clear error: ${error.message}`);
    }
  }
}
