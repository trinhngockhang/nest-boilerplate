import { Module } from '@nestjs/common';
import { ApplicationModule } from './components/applications/applications.module';
import { AuthModule } from './components/auth/auth.module';
import { DbModule } from './global_module/database/database.module';
import { OtpModule } from './global_module/otp/otp.module';
import config from './config';
import { AccKitModule } from './global_module/account_kit/kit.module';
import { PassportNewModule } from './Passport/passport.module';
import { RedisModule } from './global_module/redis/redis.module';
import { AuthorizationModule } from './components/authorization/authorization.module';
import { MailModule } from './global_module/mail/mail.module';

@Module({
  imports: [
    PassportNewModule,
    DbModule.forRoot('mysql', config.mysql),
    MailModule.forRoot('node_mailer', config.node_mailer),
    RedisModule.forRoot(config.redis),
    OtpModule.register(
      { type: 'twilio', config: config.twilio },
      { type: 'redis', config: { prefix: 'super_id', timeToLive: 5 * 60, timeToNextSend: 60 } },
    ),
    AccKitModule.forRoot('facebook', config),
    ApplicationModule,
    AuthorizationModule,
    AuthModule,
  ],
})
export class AppModule { }
