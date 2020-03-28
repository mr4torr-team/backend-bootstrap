import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnAuthorizedException extends Exception {
  constructor (message: string) {
    super(message, 422)
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle (error: this, { response }: HttpContextContract) {
    return response.status(422).json(error)
  }
}
