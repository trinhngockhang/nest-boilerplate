import { DynamicModule, Global } from '@nestjs/common';
import { DbMysqlService } from './database.service.mysql';

const createDbService = (type, config) => {
  switch (type) {
    case 'mysql':
      return {
        useValue: new DbMysqlService(config),
        provide: 'DbService',
      };
  }
};

@Global()
export class DbModule {
  public static forRoot(type, config): DynamicModule {
    const providers = createDbService(type, config);
    return {
      module: DbModule,
      providers: [providers],
      exports: [providers],
    };
  }
}
