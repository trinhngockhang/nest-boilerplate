import { IStorageOtpService } from './storageOtp.service.interface';
import { Injectable, Inject } from '@nestjs/common';
import { IDbService } from '../database/database.service.interface';

@Injectable()
export class StorageOtpDbService implements IStorageOtpService {

  private table: string = 'otps';
  private target: string = 'target';
  private otpField: string = 'otp';
  private createdTimeField: string = 'createdTime';
  private timeToLive: number;
  private timeToNextSend: number;

  constructor(
    @Inject('DbService')
    private readonly dbService: IDbService,
    config: {
      table: string,
      target: string,
      otpField: string,
      createdTimeField: string,
      timeToLive: number,
      timeToNextSend: number,
    },
  ) {
    this.table = config.table;
    this.target = config.target;
    this.otpField = config.otpField;
    this.createdTimeField = config.createdTimeField;
    this.timeToLive = config.timeToLive;
    this.timeToNextSend = config.timeToNextSend;
  }

  public async save(target: any, otp: any): Promise<void> {
    const nowInSecond = Math.floor(new Date().getTime() / 1000);
    const sql = `INSERT INTO ${this.table}(${this.target},${this.otpField},${this.createdTimeField}) VALUES (?,?,?)`;
    await this.dbService.execute(sql, [target, otp, nowInSecond]);
  }

  public async check(target: any, otp: any): Promise<boolean> {
    const nowInSecond = Math.floor(new Date().getTime() / 1000);
    const sql = `SELECT
      EXISTS(
        SELECT *
        FROM
          ${this.table}
        WHERE
          ${this.target} = ?
          AND ${this.otpField} = ?
          AND ${this.createdTimeField} > ?
      ) as exist
    `;
    const row = await this.dbService.queryOne(sql, [target, otp, nowInSecond - this.timeToLive]);
    if (row.exist) {
      const sqlDeleteOtp = `DELETE FROM ${this.table} WHERE ${this.target} = ?`;
      await this.dbService.execute(sqlDeleteOtp, [target]);
      return true;
    }
    return false;
  }

  public async canSend(target: any): Promise<boolean> {
    const nowInSecond = Math.floor(new Date().getTime() / 1000);
    const sql = `SELECT
      EXISTS(
        SELECT *
        FROM
          ${this.table}
        WHERE
          ${this.target} = ?
          AND ${this.createdTimeField} > ?
      ) as exist
    `;
    const row = await this.dbService.queryOne(sql, [target, nowInSecond - this.timeToNextSend]);
    return !row.exist;
  }

}
