
export interface IAccKitService {
  getAccessTokenAccountKit(code);
  getPhoneFromAccessToken(accessToken);
}
