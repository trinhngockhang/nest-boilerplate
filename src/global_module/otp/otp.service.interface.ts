export interface IOtpService {
  sendOtpPhone(phone): Promise<string>;
  sendOtpMail(email): Promise<string>;
  checkOtp(phone, otp): Promise<boolean>;
  canSendOtp(phone): Promise<boolean>;
}
