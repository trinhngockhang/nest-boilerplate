import { Module } from '@nestjs/common';
import { AppController } from './applications.controller';
import { AppService } from './applications.service';
@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class ApplicationModule {}
