import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import lang from '../../start/lang'

export default class LangMiddleware {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    const lng: string = ctx.request.header('content-language')
      ?? ctx.request.input('lang')
      ?? 'en'

    lang.changeLanguage(lng)
    ctx.I18n = lang

    await next()
  }
}
