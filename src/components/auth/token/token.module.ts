import { Module, Global } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

const Jwt = JwtModule.register({
  secret: 'khanghocgioi',
  signOptions: {
    expiresIn: 3600 * 24,
  },
});
@Module({
  imports: [Jwt],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
