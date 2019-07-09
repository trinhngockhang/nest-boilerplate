import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const Passport = PassportModule.register({ defaultStrategy: 'jwt' });

@Global()
@Module({
  imports: [
    Passport,
  ],
  providers: [JwtStrategy],
  exports: [Passport],
})
export class PassportNewModule {}
