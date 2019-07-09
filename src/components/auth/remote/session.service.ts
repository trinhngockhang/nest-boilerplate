import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/global_module/redis/redis.service';
import * as uuidv4 from 'uuid/v4';
import { TokenService } from '../token/token.service';
@Injectable()
export class SessionService {
  private readonly PREFIX = `REDIS_REMOTE_VERIFY`;
  private readonly EXPIRE_TIME = 180000;
  constructor(
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
  ) {}
  async createSession(): Promise<string> {
    const sessionId = uuidv4();
    const data = {
      isVerify: false,
    };
    await this.redisService.setAsync(
      `${this.PREFIX}_${sessionId}`,
      JSON.stringify(data),
      'ex',
      this.EXPIRE_TIME,
    );
    return sessionId;
  }

  async getSession(sessionId) {
    try {
      const sessionData = await this.redisService.getAsync(
        `${this.PREFIX}_${sessionId}`,
      );
      const data = JSON.parse(sessionData);

      if (data && data.isVerify) {
        await this.removeSession(sessionId);
      }
      return data;
    } catch (err) {
      // console.log('Get session error', err);
    }
    return null;
  }
  async confirmSession(sessionId, userId) {
    const sessionData = await this.getSession(sessionId);
    if (!sessionData) {
      return;
    }
    const tokens = await this.tokenService.createToken(userId);

    const data = {
      isVerify: true,
      ...tokens,
    };
    await this.redisService.setAsync(
      `${this.PREFIX}_${sessionId}`,
      JSON.stringify(data),
    );
    return data;
  }
  async removeSession(sessionId) {
    await this.redisService.delAsync(`${this.PREFIX}_${sessionId}`);
  }
}
