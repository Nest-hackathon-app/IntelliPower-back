import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
    });
  }
  async setWithTtl<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
  async clearAll(): Promise<void> {
    await this.redisClient.flushdb();
  }
  async setWithoutReset(key: string): Promise<void> {
    await this.redisClient.incr(key);
  }
}
