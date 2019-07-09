import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AppService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) { }
  @UseGuards(AuthGuard(('jwt')))
  @Get('/info/:id')
  getApplication(@Param('id') id, @Req() req) {
    return this.appService.getApplication(id);
  }
}
