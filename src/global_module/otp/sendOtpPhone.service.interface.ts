export interface ISendOtpPhoneService {
  sendOtpPhone(phone): Promise<string>;
}
