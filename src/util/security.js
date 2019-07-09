import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uuidV5 from 'uuid/v5';
import moment from 'moment';

const SALT_ROUNDS = 10;

export const uuid = id =>
  uuidV5(
    id
      ? id
      : moment()
          .valueOf()
          .toString(10),
    process.env.UUID_NAMESPACE
  );

export function md5(text) {
  return crypto
    .createHash('md5')
    .update(text)
    .digest('hex');
}

export function isMd5(hash) {
  return /^[a-z0-9]{32}$/.test(hash);
}

const { JWT_ALG, JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, JWT_ISSUER } = process.env;

export function jwtEncode(
  subject,
  custom = {},
  options = {},
  secretKey = null
) {
  return jwt.sign(custom, secretKey || JWT_PRIVATE_KEY, {
    algorithm: secretKey ? 'HS256' : JWT_ALG,
    expiresIn: 300, // 300s
    subject: String(subject),
    issuer: String(JWT_ISSUER),
    ...options
  });
}

export function jwtVerify(token, publicKey = JWT_PUBLIC_KEY) {
  return jwt.verify(String(token), publicKey, {
    issuer: String(JWT_ISSUER)
  });
}

export async function validatePassword(password, password_hash) {
  if (isMd5(password_hash)) {
    return md5(password) === password_hash;
  }

  // bcrypt
  return bcrypt.compare(password, password_hash);
}

export async function encryptPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
