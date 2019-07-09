import { Controller, Get, Param, Post, Body, UseGuards, Req, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BasicService } from './basic.service';
import { LoginDto, ChangePassDto } from './basic.validation';
@Controller('auth/basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) { }

  @Post('register')
  async createUser(@Body() body: LoginDto) {
    const { username, password } = body;
    return this.basicService.createUser(username, password);
  }

  @Post('/')
  async login(@Body() body: LoginDto) {
    const { username, password } = body;
    return this.basicService.login(username, password);
  }
  @UseGuards(AuthGuard())
  @Post('/password')
  async updatePassword(@Body() body: ChangePassDto, @Req() req) {
    const { old_password, new_password } = body;
    const { id } = req.user;
    await this.basicService.updatePassword(old_password, new_password, id);
    return 'ok';
  }
}
