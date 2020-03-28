import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ErrorException extends Exception {
  constructor (message: string) {
    super(message, 422)
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle (error: this, { response, I18n }: HttpContextContract) {
    let message: string = error.message

    if (error.message.substring(0, 4).toLocaleUpperCase() === 'I18N') {
      const regex = new RegExp(/i18n\((.*)\)/, 'i')
      const msg = error.message.match(regex)
      if (msg && msg.length >= 2) {
        message = I18n.t(msg[1]) as string
      }
    }

    return response.status(error.status).json({ message })
  }
}
