import { Controller, Get, Param, UseGuards, Req, Put } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { AuthGuard } from '@nestjs/passport';
import { SessionService } from './session.service';
// @UseGuards(AuthGuard(('jwt')))
@Controller('/auth')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}

  @Get('/')
  async getSession(): Promise<string> {
    return await this.remoteService.createSession();
  }
  @Get(':id/check')
  checkSession(@Param('id') id): Promise<string> {
    return this.remoteService.checkSession(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/verify')
  verifySession(@Param('id') id, @Req() req) {
    const userId = req.user.id;
    return this.remoteService.verifySession(id, userId);
  }
}
