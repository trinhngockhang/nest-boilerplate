import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as uuidv4 from 'uuid/v4';
import { IOtpService } from 'src/global_module/otp/otp.service.interface';
import { IDbService } from 'src/global_module/database/database.service.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class PhoneService {
  constructor(
    @Inject('OtpService') private readonly otpService: IOtpService,
    @Inject('DbService') private readonly dbService: IDbService,
    private readonly tokenService: TokenService,
  ) {}
  async login(phone) {
    const canSendOtp = await this.otpService.canSendOtp(phone);
    if (canSendOtp) {
      await this.otpService.sendOtpPhone(phone);
      return;
    }
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }

  async confirm(phone, otp) {
    const validate = await this.otpService.checkOtp(phone, otp);
    if (validate) {
      // check account exist
      const user: any = await this.checkUserExistByPhone(phone);
      if (user) {
        return this.tokenService.createToken(user.id);
      } else {
        const id = uuidv4();
        await this.createUserPhone(id, phone);
        return this.tokenService.createToken(id);
      }
    }
    throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
  }

  async createUserPhone(id, phone) {
    const createUserSql = 'INSERT INTO users(id) VALUES (?)';
    const createUserPhoneSql = 'INSERT INTO user__phone(id,phone) VALUES (?,?)';
    const transaction = await this.dbService.beginTransaction();
    try {
      await this.dbService.execute(createUserSql, [id], transaction);
      await this.dbService.execute(
        createUserPhoneSql,
        [id, phone],
        transaction,
      );
      await this.dbService.commitTransaction(transaction);
      return;
    } catch (err) {
      await this.dbService.rollbackTransaction(transaction);
      return err;
    }
  }
  async checkUserExistByPhone(phone) {
    const getUser = 'SELECT id FROM user__phone WHERE phone = ?';
    const user = await this.dbService.queryOne(getUser, [phone]);
    return user;
  }
  async linkPhone(phone, otp, id) {
    const phoneExist = await this.checkUserExistByPhone(phone);
    if (phoneExist) {
      throw new HttpException('Phone exist', HttpStatus.BAD_REQUEST);
    }
    if (!otp) {
      const canSendOtp = await this.otpService.canSendOtp(phone);
      if (canSendOtp) {
        await this.otpService.sendOtpPhone(phone);
        return 'sent otp';
      }
    }
    const validate = await this.otpService.checkOtp(phone, otp);
    if (validate) {
      const addPhoneSql = `INSERT INTO user__phone(id, phone) VALUES(?,?)`;
      await this.dbService.execute(addPhoneSql, [id, phone]);
      return 'ok';
    } else {
      throw new HttpException('Otp is wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
