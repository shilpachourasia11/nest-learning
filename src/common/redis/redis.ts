import { Redis, Cluster } from 'ioredis';
import { Injectable } from '@nestjs/common';

const host = '127.0.0.1';
const port = 6379;

@Injectable()
class RedisClient {
  public redis: Redis | Cluster;

  constructor() {
    this.redis = new Redis({ port, host, enableAutoPipelining: true });
  }

  public async close() {
    this.redis.disconnect();
  }

  get = async (key: string) => this.redis.get(key);
  set = async (key: string, data: string) => this.redis.set(key, data);
  del = async (key: string) => this.redis.del(key);
}

const redisClient = new RedisClient();

export { redisClient };
