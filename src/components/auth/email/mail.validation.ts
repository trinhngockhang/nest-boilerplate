import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ConfirmDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  otp: string;
}
