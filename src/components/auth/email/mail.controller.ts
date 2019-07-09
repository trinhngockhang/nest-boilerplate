import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, ConfirmDto } from './mail.validation';

@Controller('/auth/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('/')
  async sendOtp(@Body() body: LoginDto) {
    const { email } = body;
    return this.mailService.sendOtp(email);
  }
  @Post('/confirm')
  confirm(@Body() body: ConfirmDto) {
    const { email, otp } = body;
    return this.mailService.confirm(email, otp);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/link')
  linkPhone(@Body() body, @Req() req) {
    const { email, otp } = body;
    const { id } = req.user;
    return this.mailService.linkMail(email, otp, id);
  }
}
