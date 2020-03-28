import AuthValidator from 'App/Validators/AuthValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepository, { StoreField } from 'App/Repositories/UserRepository'
import { i18n } from 'i18next'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import JwtService, { JwtSignType } from 'App/Services/JwtService'
import TokenRepository from 'App/Repositories/TokenRepository'

export default class AuthController {
  protected request: RequestContract
  protected response: ResponseContract
  protected I18n: i18n

  /**
   *
   *
   * @protected
   * @param {string} rule
   * @param {string} [field='']
   * @param {number} [status=200]
   * @returns
   * @memberof AuthController
   */
  protected async renderStatusMessage (rule: string, field: string = '', status: number = 200) {
    return this.response.status(status).send({
      rule: rule,
      field: field,
      message: this.I18n.t(rule),
    })
  }

  /**
   *
   *
   * @protected
   * @param {string[]} fields
   * @memberof AuthController
   */
  protected async validInputBody (fields: string[]) {
    fields.forEach((field: string) => {
      if(!this.request.input(field)) {
        throw new Error(this.I18n.t('error:params_not_exist', { field }))
      }
    })
  }

  /**
   *
   *
   * @param {HttpContextContract} { request, response, I18n }
   * @returns
   * @memberof AuthController
   */
  public async authorize ({ request, response, I18n }: HttpContextContract) {
    this.I18n = I18n
    this.response = response
    this.request = request

    this.validInputBody(['email', 'password'])

    const user = await UserRepository.authorize(
      request.input('email'),
      request.input('password')
    )

    return { auth: <JwtSignType>await JwtService.sign(user) }
  }

  /**
   *
   *
   * @param {HttpContextContract} { request, I18n }
   * @returns
   * @memberof AuthController
   */
  public async renew ({ request, I18n }: HttpContextContract) {
    this.I18n = I18n
    this.request = request
    this.validInputBody(['secret'])

    return { auth: <JwtSignType>await JwtService.renew(request.input('secret')) }
  }

  /**
   * Cadastro de usuário
   *
   * @param {HttpContextContract} { request, I18n }
   * @returns
   * @memberof AuthController
   */
  public async store ({ request, I18n }: HttpContextContract) {
    await request.validate({ ...AuthValidator, messages: AuthValidator.getMessages(I18n) })

    try {
      const fields: StoreField = request.only(['username', 'password', 'email'])

      fields.locale = I18n.language
      return await UserRepository.store(fields)
    } catch (error) {
      let _error: any = error
      if (error.constraint === 'users_email_unique') {
        _error = { validate: [ AuthValidator.getMessagesUniq(I18n) ] }
      }
      throw(_error)
    }
  }

  /**
   *
   *
   * @param {HttpContextContract} { request, response, I18n }
   * @returns
   * @memberof AuthController
   */
  public async confirmation ({ request, response, I18n }: HttpContextContract) {
    this.I18n = I18n
    this.response = response

    this.validInputBody(['token'])

    const user = await UserRepository.findOne({
      active_token: request.input('token'),
      active: false,
    })

    if (!user) {
      return await this.renderStatusMessage('auth.confirmation.invalid', 'token', 422)
    }

    await UserRepository.activateAccount(user)

    return await this.renderStatusMessage('auth.confirmation.valid', 'token')
  }

  /**
   *
   *
   * @param {HttpContextContract} { request, response, I18n }
   * @returns
   * @memberof AuthController
   */
  public async recover ({ request, response, I18n }: HttpContextContract) {
    this.I18n = I18n
    this.response = response

    this.validInputBody(['email'])

    const user = await UserRepository.findOne({
      email: request.input('email'),
    })

    if (!user) {
      return await this.renderStatusMessage('auth.recover.invalid', 'email', 422)
    }

    UserRepository.recoverAccount(user)

    return await this.renderStatusMessage('auth.recover.valid', 'email')
  }

  /**
   *
   *
   * @param {HttpContextContract} { request, response, I18n }
   * @returns
   * @memberof AuthController
   */
  public async recoverChangePassword ({ request, response, I18n }: HttpContextContract) {
    this.I18n = I18n
    this.response = response

    this.validInputBody(['token', 'password'])

    const user = await UserRepository.findOne({
      active_token: request.input('token'),
      active: true,
    })

    if (!user) {
      return await this.renderStatusMessage('auth.recover_change.invalid', 'token', 422)
    }

    await UserRepository.recoverChangeAccount(
      user,
      request.input('password')
    )

    return await this.renderStatusMessage('auth.recover_change.valid', 'token')
  }

  public async revoke ({ jwtPayload }: HttpContextContract) {
    return { revoke: await TokenRepository.revoke(jwtPayload.secret) }
  }
}
