import { Injectable, Inject } from '@nestjs/common';
import { IDbService } from 'src/global_module/database/database.service.interface';
import * as uuidv4 from 'uuid/v4';
import { RedisService } from 'src/global_module/redis/redis.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class TransactionService {
  private readonly REDIS_PREFIX = 'SUPER_ID';
  constructor(
    @Inject('DbService') private readonly dbService: IDbService,
    private readonly redisService: RedisService,
  ) {}
  async getTransaction(sessionId): Promise<string> {
    const data = await this.redisService.getAsync(
      `${this.REDIS_PREFIX}_${sessionId}`,
    );
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log('error getting transaction', e);
      }
    }
    return null;
  }
  async getApplication(id) {
    const sql = 'SELECT * FROM applications WHERE id = ?';
    const app = await this.dbService.queryOne(sql, [id]);
    return app;
  }
  async createTransaction(app_id, timeout = 86400) {
    const sessionId = uuidv4();
    const transaction = {
      status: 200,
      app_id,
      data: {
        status: 200,
        message: 'pending',
      },
    };

    await this.redisService.setAsync(
      `${this.REDIS_PREFIX}_${sessionId}`,
      JSON.stringify(transaction),
      'ex',
      timeout,
    );
    return sessionId;
  }
  async confirmTransaction(userId, sessionId, timeout = 86400) {
    const data = await this.redisService.getAsync(
      `${this.REDIS_PREFIX}_${sessionId}`,
    );

    if (data) {
      try {
        const currentValue = JSON.parse(data);
        const { app_id } = currentValue;
        if (app_id) {
          const application = await this.getApplication(app_id);
          const { app_secret } = application;
          const user = await this.getMe(userId, app_id);
          const access_token = await jwt.sign({ user, app_id }, app_secret, {
            expiresIn: timeout,
          });
          const newValue = {
            ...currentValue,
            data: {
              status: 200,
              access_token,
            },
          };
          await this.redisService.setAsync(
            `${this.REDIS_PREFIX}_${sessionId}`,
            JSON.stringify(newValue),
            'ex',
            timeout,
          );
        }
      } catch (err) {
        console.log('error updating transaction', err);
      }
    }
  }
  async getAppPermission(appId) {
    const appInfoSql = `
      SELECT ap.permission_id
      FROM applications_permissions ap
      WHERE ap.application_id = ?`;
    const permissions = await this.dbService.query(appInfoSql, [appId]);
    const permissionArr = [];
    for (const element in permissions) {
      if (permissions.hasOwnProperty(element)) {
        const permission = permissions[element];
        permissionArr.push(permission.permission_id);
      }
    }
    return permissionArr;
  }
  async getMe(userId, appId) {
    const permissions = await this.getAppPermission(appId);
    if (permissions.length === 0) {
      return null;
    }
    let listJoin = '';
    let tableList = [];
    const listData = permissions
      .map(doc => {
        const tableName = doc.substring(0, doc.indexOf('.'));
        if (!tableList.includes(tableName)) {
          listJoin += ` LEFT JOIN user__${tableName} ON users.id = user__${tableName}.id `;
          tableList.push(tableName);
        }
        return 'user__' + doc + ' as ' + doc.replace('.', '_');
      })
      .join(',');
    const getInfoSql = `
      SELECT ${listData} FROM users
      ${listJoin}
      WHERE users.id = ?
    `;
    const info = await this.dbService.query(getInfoSql, [userId]);
    return info;
  }
}
