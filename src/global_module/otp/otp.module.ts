import { Global, DynamicModule, Provider } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpTwilioService } from './sendOtp.service.twilio';
import { SendOtpCbckService } from './sendOtp.service.cbck';
import { StorageOtpDbService } from './storageOtp.service.db';
import { StorageOtpRedisService } from './storageOtp.service.redis';
import { IDbService } from '../database/database.service.interface';
import { IRedisService } from '../redis/redis.service.interface';
import { SendOtpMailService } from './sendOtp.service.mail';

const createSendOtpPhoneService = ({ type, config }) => {
  switch (type) {
    case 'twilio':
      return {
        provide: 'SendOtpService',
        useValue: new SendOtpTwilioService(config),
      };
    case 'cbck':
      return {
        provide: 'SendOtpService',
        useValue: new SendOtpCbckService(),
      };
  }
};

const createStorageOtpService = ({ type, config }) => {
  switch (type) {
    case 'db':
      return {
        provide: 'StorageOtpService',
        useFactory: (dbService: IDbService) => {
          return new StorageOtpDbService(dbService, config);
        },
        inject: ['DbService'],
      };
    case 'redis':
      return {
        provide: 'StorageOtpService',
        useFactory: (redisService: IRedisService) => {
          return new StorageOtpRedisService(redisService, config);
        },
        inject: ['RedisService'],
      };
  }
};

@Global()
export class OtpModule {
  public static register(
    sendOtpConfig: { type: string, config: any },
    storageOtpConfig: { type: string, config: any }): DynamicModule {
    const sendOtpService = createSendOtpPhoneService(sendOtpConfig);
    const storageOtpService = createStorageOtpService(storageOtpConfig);
    return {
      module: OtpModule,
      providers: [sendOtpService, storageOtpService, OtpService, SendOtpMailService],
      exports: [OtpService],
    };
  }
}
