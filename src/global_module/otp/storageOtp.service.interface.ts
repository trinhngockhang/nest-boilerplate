export interface IStorageOtpService {
  save(target, otp): Promise<void>;
  check(target, otp): Promise<boolean>;
  canSend(target): Promise<boolean>;
}
