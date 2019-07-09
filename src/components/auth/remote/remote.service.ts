import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class RemoteService {
  constructor(private readonly sessionService: SessionService) {}
  async createSession(): Promise<string> {
    return this.sessionService.createSession();
  }
  async checkSession(sessionId): Promise<string> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) return 'AUTH_REMOTE_SESSION_NOT_FOUND';

    return session;
  }
  async verifySession(session_id, user_id): Promise<string> {
    const session = await this.sessionService.confirmSession(
      session_id,
      user_id,
    );

    if (!session) return 'AUTH_REMOTE_SESSION_NOT_FOUND';

    return 'ok';
  }
}
