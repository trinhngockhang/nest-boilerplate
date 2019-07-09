import { Injectable, Inject } from '@nestjs/common';
import { IMailService } from '../mail/mail.service.interface';

const pad = (num, size) => {
  let s = String(num);
  while (s.length < (size || 2)) {
    s = '0' + s;
  }
  return s;
};

@Injectable()
export class SendOtpMailService {
  constructor(
    @Inject('MailService') private readonly mailService: IMailService,
  ) {}
  async sendOtpMail(email): Promise<string> {
    const otp = pad(Math.floor(Math.random() * 10000), 4);
    const data = {
      subject: 'Super Id verification',
      contents: `Your verify code is ${otp}`,
    };
    await this.mailService.send(data, email);
    return otp;
  }
}
