import * as redis from 'redis';
import * as bluebird from 'bluebird';
import { Injectable } from '@nestjs/common';
import { IRedisService } from './redis.service.interface';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

@Injectable()
export class RedisService implements IRedisService {
  private client = null;

  constructor(config) {
    this.client = redis.createClient(config.redisUrl);
    this.client.on('error', () => {
      this.client.quit();
    });
  }
  public async setAsync(...params) {
    return this.client.setAsync(params);
  }
  public async getAsync(...params) {
    return this.client.getAsync(params);
  }
  public async delAsync(...params) {
    return this.client.delAsync(params);
  }
  public async ttlAsync(...params) {
    return this.client.ttlAsync(params);
  }
}
