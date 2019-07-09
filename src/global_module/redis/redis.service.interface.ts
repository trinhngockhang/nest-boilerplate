export interface IRedisService {
  setAsync(...params);
  getAsync(...params);
  delAsync(...params);
  ttlAsync(...params);
}
