import { Module } from '@nestjs/common';
import { AuthorController } from './authorization.controller';
import { AuthorService } from './authorization.service';
import { TransactionService } from './transaction.service';
@Module({
  controllers: [AuthorController],
  providers: [AuthorService, TransactionService],
})
export class AuthorizationModule {}
