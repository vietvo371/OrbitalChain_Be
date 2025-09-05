import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private config: RateLimitConfig) {}

  use = (req: Request, res: Response, next: NextFunction) => {
    const key = this.getKey(req);
    const now = Date.now();
    const windowMs = this.config.windowMs;
    const max = this.config.max;

    // Clean up expired entries
    this.cleanup();

    const current = this.requests.get(key);
    
    if (!current) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > current.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      return res.status(429).json({
        statusCode: 429,
        message: this.config.message || 'Too many requests',
        error: 'Too Many Requests',
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      });
    }

    current.count++;
    next();
  }

  private getKey(req: Request): string {
    // Use IP + User Agent for more accurate rate limiting
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || '';
    return `${ip}:${userAgent}`;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}
