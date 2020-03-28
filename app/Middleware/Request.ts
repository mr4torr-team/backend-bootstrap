import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ErrorException from 'App/Exceptions/ErrorException'
import JwtService from 'App/Services/JwtService'
import UserRepository from 'App/Repositories/UserRepository'

export default class Request {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    const tokenHeader: string | undefined = ctx.request.header('authorization')

    if (!tokenHeader) {
      throw new ErrorException('I18n(error:auth.token_not_exist)')
    }

    const token = <string>tokenHeader.substring(7)

    const { jwtPayload, jwtRenew } = await JwtService.verify(token)

    const user = await UserRepository.findOneWithToken({
      id: jwtPayload.id,
      active: true,
    })

    if (!user) {
      throw new ErrorException('I18n(error:user.inative)')
    }

    if (!user.token) {
      throw new ErrorException('I18n(error:user.disconnected)')
    }

    ctx.auth = user

    if (jwtRenew) {
      ctx.response.append('content-token', jwtRenew.token)
      ctx.response.append('content-secret', jwtRenew.secret)
      ctx.response.append('content-expiry', jwtRenew.expiry)
    }

    ctx.jwtPayload = jwtRenew
      ? JwtService.decode(jwtRenew.token)
      : jwtPayload

    await next()
  }
}
