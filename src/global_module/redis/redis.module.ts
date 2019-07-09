import { DynamicModule, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

const createRedisService = (config) => {
  return {
    provide: 'RedisService',
    useValue: new RedisService(config),
  };
};

@Global()
export class RedisModule {
  public static forRoot(config): DynamicModule {
    const redisService = createRedisService(config);
    return {
      module: RedisModule,
      providers: [redisService],
      exports: [redisService],
    };
  }
}
