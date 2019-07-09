import { Inject, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as uuidv4 from 'uuid/v4';
import { hash, compare } from '../../../util/bcryptUtil';
import { IDbService } from 'src/global_module/database/database.service.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class BasicService {
  constructor(
    @Inject('DbService') private readonly dbService: IDbService,
    private readonly tokenService: TokenService,
  ) { }
  async createUser(username: string, password: string) {
    const id = uuidv4();
    const userBasicSql = `
    INSERT INTO user__basic(id,username,password_hash)
    VALUES(?,?,?)`;
    const userSql = `INSERT INTO users(id) VALUES (?)`;
    const transaction = await this.dbService.beginTransaction();
    try {
      await this.dbService.execute(userSql, [id], transaction);
      await this.dbService.execute(userBasicSql, [id, username, hash(password)], transaction);
      await this.dbService.commitTransaction(transaction);
      return;
    } catch (err) {
      await this.dbService.rollbackTransaction(transaction);
    }
  }

  async login(username: string, password: string) {
    const existUserSql = 'SELECT id,username,password_hash FROM user__basic WHERE username = ?';
    const user = await this.dbService.queryOne(existUserSql, [username]);
    if (user) {
      if (await compare(password, user.password_hash)) {
        return this.tokenService.createToken(user.id);
      }
      throw new HttpException('Wrong pass', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
  }

  async updatePassword(old_pass, new_pass, id){
    const passwordSql = 'SELECT password_hash FROM user__basic WHERE id = ?';
    const user = await this.dbService.queryOne(passwordSql, [id]);
    if(! (await compare(old_pass, user.password_hash)) ){
      throw new HttpException('Old password is wrong', HttpStatus.UNAUTHORIZED);
    }
    const updatePassSql = 'UPDATE user__basic SET password_hash = ? WHERE id = ?';
    await this.dbService.execute(updatePassSql, [hash(new_pass), id]);
    return 'ok';
  }
}
