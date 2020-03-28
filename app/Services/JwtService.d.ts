import { Token } from 'App/Models/Token'

export declare module 'App/Services/JwtService' {
  export type JwtSignType = {
    secret: any;
    token: any;
    expiry: number;
  }

  export type JwtPayloadType = {
    id: any;
    username: any;
    email: any;
    locale: any;
    timeZone: any;
    secret: any;
    iss: any;
    iat: number;
    exp: number;
  }

  export type JwtSecretExpiredType = {
    token: Token;
    timeZone: string;
  }

  export type JwtVerifyType = {
    jwtPayload: JwtPayloadType;
    jwtRenew: JwtSignType | undefined;
  }
}
