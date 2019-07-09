import { Module } from '@nestjs/common';
import { BasicModule } from './basic/basic.module';
import { PhoneModule } from './phone/phone.module';
import { RemoteModule } from './remote/remote.module';
import { MailModule } from './email/mail.module';
@Module({
  imports: [
    BasicModule,
    PhoneModule,
    RemoteModule,
    MailModule,
  ],
  providers: [],
})
export class AuthModule { }
