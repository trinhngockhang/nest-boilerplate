import { IStorageOtpService } from './storageOtp.service.interface';
import { Injectable, Inject } from '@nestjs/common';
import { IRedisService } from '../redis/redis.service.interface';

@Injectable()
export class StorageOtpRedisService implements IStorageOtpService {
  private prefix: string;
  private timeToLive: number;
  private timeToNextSend: number;

  constructor(
    @Inject('RedisService') private readonly redisService: IRedisService,
    config: { prefix: string, timeToLive: number, timeToNextSend: number }) {
    this.prefix = config.prefix;
    this.timeToLive = config.timeToLive;
    this.timeToNextSend = config.timeToNextSend;
  }

  public async save(target: any, otp: any): Promise<void> {
    await this.redisService.setAsync(`${this.prefix}:otp:${target}`, otp, 'ex', this.timeToLive);
  }

  public async check(target: any, otp: any): Promise<boolean> {
    const otpSaved = await this.redisService.getAsync(`${this.prefix}:otp:${target}`);
    const validate = otpSaved && otpSaved === otp;
    if (validate) {
      await this.redisService.delAsync(`${this.prefix}:otp:${target}`);
      return true;
    }
    return false;
  }

  public async canSend(target: any): Promise<boolean> {
    const timeToLive = await this.redisService.ttlAsync(`${this.prefix}:otp:${target}`);
    if (this.timeToLive - timeToLive > this.timeToNextSend) {
      return true;
    }
    return false;
  }
}
