import { IsNotEmpty, IsPhoneNumber, IsMobilePhone } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsPhoneNumber(null)
  @IsMobilePhone('vi-VN')
  phone: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ConfirmDto {
  @IsNotEmpty()
  @IsPhoneNumber(null)
  phone: string;
  @IsNotEmpty()
  otp: string;
}
