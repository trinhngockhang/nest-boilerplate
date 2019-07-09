import { Injectable, Inject } from '@nestjs/common';
import { IDbService } from 'src/global_module/database/database.service.interface';

@Injectable()
export class AppService {
  constructor(@Inject('DbService') private readonly dbService: IDbService) {}
  async getApplication(id: number) {
    const appInfoSql = `
      SELECT p.description as permission
      FROM applications_permissions ap
      INNER JOIN  permissions p
      ON p.id = ap.permission_id
      WHERE ap.application_id = ?`;
    const appNameSql = `SELECT app.title FROM applications app where id = ?`;
    const appInfo = await this.dbService.query(appInfoSql, [id]);
    const appName = await this.dbService.query(appNameSql, [id]);
    return {
      appInfo,
      appName,
    };
  }
}
