import {EncryptJWT, base64url, jwtDecrypt, jwtVerify} from 'jose';

const secret = base64url.decode(process.env['JWT_SECRET'] || '');
const opts = Object.freeze({
  issuer: 'https://github.com/elkeis/things-app',
  audience: 'https://hos247.com',
  expirationTime: '2h',
  protectedHeader: Object.freeze({
    alg: 'dir',
    enc: 'A128CBC-HS256'
  })
})


export const encrypt = async <T extends {}>(payload: T) => {
  return await new EncryptJWT(payload)
    .setProtectedHeader({...opts.protectedHeader})
    .setIssuedAt(Date.now())
    .setIssuer(opts.issuer)
    .setAudience(opts.audience)
    .setExpirationTime(opts.expirationTime)
    .encrypt(secret);
}

export const decrypt = async (jwt: string) => {
  return await jwtDecrypt(jwt, secret, {
    issuer: opts.issuer,
    audience: opts.audience,
  })
}

export const safeDecrypt = async (jwt: string) => {
  return await jwtVerify(jwt, secret, {
    issuer: opts.issuer,
    audience: opts.audience,
  })
}

