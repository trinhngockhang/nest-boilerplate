import * as twilio from 'twilio';
import { ISendOtpPhoneService } from './sendOtpPhone.service.interface';
import { Injectable } from '@nestjs/common';

const pad = (num, size) => {
  let s = String(num);
  while (s.length < (size || 2)) { s = '0' + s; }
  return s;
};

@Injectable()
export class SendOtpTwilioService implements ISendOtpPhoneService {

  private client: twilio.Twilio = null;
  private phone: string;
  constructor(config: { accountSid: string, authToken: string, phone: string }) {
    this.client = twilio(config.accountSid, config.authToken);
    this.phone = config.phone;
  }
  public async sendOtpPhone(phone: any): Promise<string> {
    const otp = pad(Math.floor(Math.random() * 10000), 4);
    const messageBody = {
      to: phone,
      from: this.phone,
      body: `Your verification code is ${otp}`,
    };
    await this.client.messages.create(messageBody);
    return otp;
  }
}
