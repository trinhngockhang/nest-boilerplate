import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IDbService } from 'src/global_module/database/database.service.interface';

@Injectable()
export class AuthorService {
  constructor(
    @Inject('DbService') private readonly dbService: IDbService,
    private readonly transactionService: TransactionService,
  ) {}
  getTransaction(id): Promise<string> {
    return this.transactionService.getTransaction(id);
  }
  async createTransaction(appId, timeOut) {
    const app = await this.transactionService.getApplication(appId);
    if (app) {
      const sessionId = await this.transactionService.createTransaction(
        appId,
        timeOut,
      );
      return sessionId;
    }
    throw new HttpException('Not found application', HttpStatus.NOT_FOUND);
  }
  async confirmTransaction(userId, sessionId, timeout) {
    const transaction = await this.transactionService.getTransaction(sessionId);
    if (transaction) {
      await this.transactionService.confirmTransaction(
        userId,
        sessionId,
        timeout,
      );
      return 'ok';
    }
  }
  async getAppPermission(appId) {
    return await this.transactionService.getAppPermission(appId);
  }
}
