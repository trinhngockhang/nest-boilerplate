import { Module } from '@nestjs/common';
import { RemoteController } from './remote.controller';
import { RemoteService } from './remote.service';
import { SessionService } from './session.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [RemoteController],
  providers: [RemoteService, SessionService],
})
export class RemoteModule {}
