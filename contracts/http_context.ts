import { i18n } from 'i18next'
import { JwtPayloadType } from 'App/Services/JwtService'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    auth: any,
    I18n: i18n,
    jwtPayload: JwtPayloadType
  }
}
