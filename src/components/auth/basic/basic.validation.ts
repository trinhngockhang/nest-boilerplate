import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ChangePassDto {
  @IsNotEmpty()
  @Length(6, 20)
  old_password: string;
  @IsNotEmpty()
  @Length(6, 20)
  new_password: string;
}
