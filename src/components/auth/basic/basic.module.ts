import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { TokenModule } from '../token/token.module';
@Module({
  imports: [ TokenModule ],
  controllers: [BasicController],
  providers: [ BasicService ],
})
export class BasicModule {}
