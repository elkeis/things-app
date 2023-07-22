import * as jwt from 'jsonwebtoken';

const secret = process.env['jwt_secret'] || '';

export const encrypt = async <T extends {}>(payload: T) => {
  return await jwt.sign(payload, secret);
}

export const decrypt = async (jwtString: string) => {
  return await jwt.decode(jwtString)
}

export const safeDecrypt = async (jwtString: string) => {
  return await jwt.verify(jwtString, secret);
}

