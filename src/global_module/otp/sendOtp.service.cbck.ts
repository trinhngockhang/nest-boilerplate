import { ISendOtpPhoneService } from './sendOtpPhone.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendOtpCbckService implements ISendOtpPhoneService {
  public async sendOtpPhone(phone: any): Promise<string> {
    return 'Vi~ best Gnar';
  }
}
