import { ISendOtpPhoneService } from './sendOtpPhone.service.interface';
import { IStorageOtpService } from './storageOtp.service.interface';
import { Injectable, Inject } from '@nestjs/common';
import { IOtpService } from './otp.service.interface';
import { SendOtpMailService } from './sendOtp.service.mail';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject('SendOtpService') private readonly sendOtpService: ISendOtpPhoneService,
    @Inject('StorageOtpService') private readonly storageOtpService: IStorageOtpService,
    private readonly sendOtpMailService: SendOtpMailService,
  ) { }
  public async sendOtpPhone(phone): Promise<string> {
    const otp = await this.sendOtpService.sendOtpPhone(phone);
    await this.storageOtpService.save(phone, otp);
    return otp;
  }
  public async sendOtpMail(email): Promise<string> {
    const otp = await this.sendOtpMailService.sendOtpMail(email);
    await this.storageOtpService.save(email, otp);
    return otp;
  }
  public async checkOtp(target, otp): Promise<boolean> {
    const validate = await this.storageOtpService.check(target, otp);
    return validate;
  }
  public async canSendOtp(target): Promise<boolean> {
    const canSend = await this.storageOtpService.canSend(target);
    return canSend;
  }
}
