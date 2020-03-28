/// <reference path="./JwtService.d.ts" />

import * as jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import { pick } from 'lodash'
import ErrorException from 'App/Exceptions/ErrorException'
import TokenRepository from 'App/Repositories/TokenRepository'
import moment from 'moment-timezone'

class JwtService {
  protected jwtSecret: string
  protected jwtExpire: number
  protected jwtFieldsUser = ['id', 'username', 'email', 'locale', 'timeZone']

  constructor () {
    this.jwtSecret = Env.get('JWT_SECRET') as string
    this.jwtExpire = parseInt(<string>Env.get('JWT_EXPIRE', '300'))
  }

  public sign = async (user: User): Promise<JwtSignType> => {
    const data = pick(user.$attributes, this.jwtFieldsUser) as JwtPayloadType

    const now = Math.floor(Date.now() / 1000)
    const secret = await TokenRepository.store(user)

    const expiry = now + this.jwtExpire
    data.secret = secret.token
    data.iss = `api_keys/${secret.id}`
    data.iat = now
    data.exp = now + this.jwtExpire

    return {
      token: jwt.sign(data, this.jwtSecret),
      secret: secret.token,
      expiry,
    }
  }

  public async checkSecretExpired ({ token, timeZone}: JwtSecretExpiredType): Promise<boolean> {
    const createdAt = token.createdAt.setZone(timeZone).toBSON()
    const expiredTime = parseInt(
      Env.get('JWT_EXPIRE', '300') as string
    ) + parseInt(
      Env.get('JWT_EXPIRE_SECRET', '300') as string
    )

    let today = moment().tz(timeZone)

    const duration = moment.duration({ seconds: expiredTime })
    let limit = moment(createdAt).tz(timeZone).add(duration)

    // Bloqueia se passar do limite permitido para fazer renovação do
    // token expirado
    if (today.isAfter(limit)) {
      throw new ErrorException('I18n(error:auth.secret_expired)')
    }

    return true
  }

  public async renew (token: string): Promise<JwtSignType> {
    const tokenReg = await TokenRepository.findByTokenWithUser(token)
    const checkOptions = { token: tokenReg, timeZone: tokenReg.user.timeZone }
    await this.checkSecretExpired(checkOptions)

    return await this.sign(tokenReg.user)
  }

  public async verify (token: string): Promise<JwtVerifyType> {
    let jwtPayload: JwtPayloadType
    let jwtRenew: JwtSignType | undefined

    try {
      jwtPayload = <JwtPayloadType>jwt.verify(token, this.jwtSecret)
    } catch (error) {
      jwtPayload = this.decode(token)
      jwtRenew = <JwtSignType>await this.renew(jwtPayload.secret)
    }

    return { jwtPayload, jwtRenew }
  }

  public decode (token: string): JwtPayloadType {
    return <JwtPayloadType>jwt.decode(token)
  }
}

export default new JwtService()
