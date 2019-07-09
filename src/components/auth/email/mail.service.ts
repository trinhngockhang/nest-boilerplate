import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { IOtpService } from 'src/global_module/otp/otp.service.interface';
import * as uuidv4 from 'uuid/v4';
import { IDbService } from 'src/global_module/database/database.service.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject('OtpService') private readonly otpService: IOtpService,
    @Inject('DbService') private readonly dbService: IDbService,
    private readonly tokenService: TokenService,
  ) {}
  async sendOtp(email) {
    const canSendOtp = await this.otpService.canSendOtp(email);
    if (canSendOtp) {
      await this.otpService.sendOtpMail(email);
      return;
    }
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }
  async confirm(email, otp) {
    const validate = await this.otpService.checkOtp(email, otp);
    if (validate) {
      // check account exist
      const user: any = await this.checkUserExistByEmail(email);
      if (user) {
        return this.tokenService.createToken(user.id);
      } else {
        const id = uuidv4();
        await this.createUserMail(id, email);
        return this.tokenService.createToken(id);
      }
    }
    throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
  }
  async createUserMail(id, email) {
    const createUserSql = 'INSERT INTO users(id) VALUES (?)';
    const createUserMailSql = 'INSERT INTO user__email(id,email) VALUES (?,?)';
    const transaction = await this.dbService.beginTransaction();
    try {
      await this.dbService.execute(createUserSql, [id], transaction);
      await this.dbService.execute(
        createUserMailSql,
        [id, email],
        transaction,
      );
      await this.dbService.commitTransaction(transaction);
      return;
    } catch (err) {
      await this.dbService.rollbackTransaction(transaction);
      return err;
    }
  }
  async checkUserExistByEmail(email) {
    const getUser = 'SELECT id FROM user__email WHERE email = ?';
    const user = await this.dbService.queryOne(getUser, [email]);
    return user;
  }
  async linkMail(email, otp, id) {
    const emailExist = await this.checkUserExistByEmail(email);
    if (emailExist) {
      throw new HttpException('email exist', HttpStatus.BAD_REQUEST);
    }
    if (!otp) {
      const canSendOtp = await this.otpService.canSendOtp(email);
      if (canSendOtp) {
        await this.otpService.sendOtpMail(email);
        return 'sent otp';
      }
    }
    const validate = await this.otpService.checkOtp(email, otp);
    if (validate) {
      const addemailSql = `INSERT INTO user__email(id, email) VALUES(?,?)`;
      await this.dbService.execute(addemailSql, [id, email]);
      return 'ok';
    } else {
      throw new HttpException('Otp is wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
