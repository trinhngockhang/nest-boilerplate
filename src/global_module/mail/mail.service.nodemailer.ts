import { IMailService } from './mail.service.interface';
import * as nodemailer from 'nodemailer';
export class NodeMailerService implements IMailService {
  private transporter;
  private config;
  constructor(config) {
    this.config = config;
    // console.log(config);
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      service: this.config.service,
      auth: {
        user: this.config.userMail,
        pass: this.config.pass,
      },
    });
  }
  async send(data, receivers) {
    const mailOptions = {
      from: this.config.userMail,
      to: receivers,
      subject: data.subject,
      text: data.contents,
    };
    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}
