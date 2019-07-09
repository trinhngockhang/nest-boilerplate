import { Global, DynamicModule } from '@nestjs/common';
import { FbAccKitService } from './kit.service.facebook';

const createAccKitService = (type, config) => {
  switch (type) {
    case 'facebook':
      return {
        useValue: new FbAccKitService(config),
        provide: 'FbAccKitService',
      };
  }
};
@Global()
export class AccKitModule {
  static forRoot(type, config): DynamicModule {
    const providers = createAccKitService(type, config);
    return {
      module: AccKitModule,
      providers: [providers],
      exports: [providers],
    };
  }
}
