import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, ConfirmDto } from './phone.validation';

@Controller('/auth/phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}
  @Post('/')
  async login(@Body() body: LoginDto) {
    const { phone } = body;
    console.log('dang cbi gui');
    await this.phoneService.login(phone);
    console.log('gui roi');
    return 'ok';
  }
  @Post('/confirm')
  confirm(@Body() body: ConfirmDto) {
    const { phone, otp } = body;
    return this.phoneService.confirm(phone, otp);
  }
  @UseGuards(AuthGuard(('jwt')))
  @Post('/link')
  linkPhone(@Body() body: ConfirmDto, @Req() req) {
    const { phone, otp } = body;
    const { id } = req.user;
    return this.phoneService.linkPhone(phone, otp, id);
  }
}
