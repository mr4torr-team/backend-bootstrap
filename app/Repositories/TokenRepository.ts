import Token from 'App/Models/Token'
import User from 'App/Models/User'
import Encryption from '@ioc:Adonis/Core/Encryption'
import ErrorException from 'App/Exceptions/ErrorException'

class TokenRepository {
  private async findByCall (secret: string, cb: any) {
    const where = {
      type: 'jwt_refresh_token',
      token: secret,
    }

    const token = <Token>await cb(where)

    if(!token) {
      throw new ErrorException('I18n(error:auth.secret)')
    }

    if(token.isRevoked === true) {
      throw new ErrorException('I18n(error:user.disconnected)')
    }

    return token
  }

  /**
   *
   *
   * @param {string} secret
   * @returns
   * @memberof TokenRepository
   */
  public async findByToken (secret: string) {
    return await this.findByCall(secret, async (where) => {
      return await Token.query().where(where).first()
    })
  }
  /**
   *
   *
   * @param {string} secret
   * @returns
   * @memberof TokenRepository
   */
  public async findByTokenWithUser (secret: string) {
    return await this.findByCall(secret, async (where) => {
      return await Token.query().preload('user').where(where).first()
    })
  }

  /**
   *
   *
   * @param {string} secret
   * @returns {Promise<boolean>}
   * @memberof TokenRepository
   */
  public async revoke (secret: string): Promise<boolean> {
    const token = await Token.query()
      .where({ token: secret, type: 'jwt_refresh_token' })
      .update({ is_revoked: true })
      .first()

    if (!token) {
      return false
    }

    return true
  }

  /**
   *
   *
   * @param {User} user
   * @returns {Promise<Token>}
   * @memberof TokenRepository
   */
  public async store (user: User): Promise<Token> {
    await Token.query()
      .where({ isRevoked: false, userId: user.id, type: 'jwt_refresh_token' })
      .update({ is_revoked: true })
      .exec()

    let result: null | Token = null
    let counter = 0

    while (!result && counter < 5) {
      result = await Token.create({
        token: Encryption.encrypt(Date.now()),
        isRevoked: false,
        type: 'jwt_refresh_token',
        userId: user.id,
      })
      counter++
    }

    return result as Token
  }
}

export default new TokenRepository()
