import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './authorization.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard(('jwt')))
@Controller('/authorization')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('/polling/:session_id')
  async getTransaction(@Param('session_id') sessionId): Promise<string> {
    return await this.authorService.getTransaction(sessionId);
  }

  @Post('/transaction')
  async createTransaction(@Body('app_id') appId) {
    const timeOut = 18000;
    return await this.authorService.createTransaction(appId, timeOut);
  }

  @Get('/app/info/:app_id')
  async getApp(@Param('app_id') appId) {
    return await this.authorService.getAppPermission(appId);
  }

  @Post('/confirmation')
  async confirm(@Body('session_id') sessionId, @Req() req) {
    const userId = req.user.id;
    return await this.authorService.confirmTransaction(userId, sessionId, 18000);
  }
}
