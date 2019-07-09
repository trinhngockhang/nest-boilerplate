import * as mysql from 'mysql';
import { IDbService } from './database.service.interface';

export class DbMysqlService implements IDbService {
  private readonly pool;

  constructor(config) {
    this.pool = mysql.createPool(config.databaseUrl);
  }

  public async getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        resolve(connection);
        return;
      });
    });
  }

  public async beginTransaction() {
    const connection: any = await this.getConnection();
    return new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          return reject(err);
        }
        return resolve(connection);
      });
    });
  }

  public async rollbackTransaction(transaction: any) {
    return new Promise((resolve, reject) => {
      transaction.rollback(err => {
        transaction.release();
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  public async commitTransaction(transaction: any) {
    return new Promise((resolve, reject) => {
      transaction.commit(async errCommit => {
        if (errCommit) {
          try {
            await this.rollbackTransaction(transaction);
          } catch (errorRollback) {
            return reject(Object.assign(errCommit, { errorRollback }));
          }
          return reject(errCommit);
        }
        transaction.release();
        return resolve();
      });
    });
  }

  public async query(sql: any, params?: any) {
    const sqlFormatted = mysql.format(sql, params);
    // console.log('----------------------------');
    // console.log('sql', sqlFormatted);
    // console.log('----------------------------');
    return new Promise((resolve, reject) => {
      this.pool.query(sqlFormatted, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  public async queryOne(sql: any, params: any) {
    const result = await this.query(sql, params);
    return result[0];
  }

  public async execute(sql: any, params: any, transaction?: any) {
    return new Promise((resolve, reject) => {
      if (!transaction) {
        this.pool.query(sql, params, (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        });
      } else {
        transaction.query(sql, params, (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        });
      }
    });
  }
}
