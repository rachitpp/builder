import { Request, Response, NextFunction } from "express";
import { CacheService } from "../services/cacheService";
import { logger } from "../utils/logger";

/**
 * Cache middleware for API responses
 * @param keyPrefix Prefix for the cache key
 * @param duration Cache duration in seconds
 */
export const cacheResponse = (keyPrefix: string, duration = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Build cache key based on the request URL and any query parameters
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      // Try to get data from cache
      const cachedData = await CacheService.get(cacheKey);

      if (cachedData) {
        // Send cached response
        return res.status(200).json(cachedData);
      }

      // Store the original res.json method
      const originalJson = res.json;

      // Override res.json method to cache the response before sending
      res.json = function (body: any): Response {
        // Restore the original res.json method
        res.json = originalJson;

        // Cache the response if it's successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          CacheService.set(cacheKey, body, duration).catch((err) => {
            logger.error(`Error caching response: ${err.message}`);
          });
        }

        // Call the original json method
        return originalJson.call(this, body);
      };

      next();
    } catch (error: any) {
      logger.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};
