import * as request from 'request';
import { IAccKitService } from './kit.service.interface';

export class FbAccKitService implements IAccKitService {
  constructor(private readonly config) {
    this.config = config.facebook_account_kit;
  }
  async getAccessTokenAccountKit(code) {
    const options = {
      qs: {
        grant_type: 'authorization_code',
        access_token: `AA|${this.config.APP_ID}|${this.config.APP_KIT_SECRET}`,
        code,
      },
      baseUrl: this.config.ACCOUNT_KIT_URL,
    };
    return new Promise((resolve, reject) => {
      request.get('/access_token', options, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        const bodyObj = JSON.parse(body);
        if (bodyObj.error) {
          return reject(bodyObj.error);
        }
        return resolve(JSON.parse(body).access_token);
      });
    });
  }
  getPhoneFromAccessToken(accessToken) {
    const options = {
      qs: {
        access_token: accessToken,
      },
      baseUrl: this.config.ACCOUNT_KIT_URL,
    };
    return new Promise((resolve, reject) => {
      request.get('/me', options, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        const bodyObj = JSON.parse(body);
        if (bodyObj.error) {
          return reject(bodyObj.error);
        }
        return resolve(JSON.parse(body).phone.number);
      });
    });
  }
}
