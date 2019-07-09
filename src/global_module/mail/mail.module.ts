import { DynamicModule, Global } from '@nestjs/common';
import { NodeMailerService } from './mail.service.nodemailer';

const createMailService = (type, config) => {
  switch (type) {
    case 'node_mailer':
      return {
        useValue: new NodeMailerService(config),
        provide: 'MailService',
      };
  }
};

@Global()
export class MailModule {
  public static forRoot(type, config): DynamicModule {
    const providers = createMailService(type, config);
    return {
      module: MailModule,
      providers: [providers],
      exports: [providers],
    };
  }
}
