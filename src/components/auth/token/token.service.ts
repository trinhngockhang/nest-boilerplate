import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) { }
  async createToken(id: string) {
    const user = { id };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: 3600 * 24,
      accessToken,
    };
  }
}
