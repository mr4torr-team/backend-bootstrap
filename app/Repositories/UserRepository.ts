/// <reference path="./UserRepository.d.ts" />

import Event, { EmitterContract } from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import GenerateToken from 'App/Commons/GenerateToken'
import ErrorException from 'App/Exceptions/ErrorException'

// import { EmitterContract } from '@adonisjs/events/build/standalone'

class UserRepository {
  private event: EmitterContract

  constructor (event: EmitterContract) {
    this.event = event
  }

  /**
   *
   *
   * @param {StoreField} fields
   * @returns
   * @memberof UserRepository
   */
  public async store (fields: StoreField) {
    const user = await User.create({
      ...fields,
      activeToken: await GenerateToken([fields.username, fields.email]),
      password: await Hash.hash(fields.password),
    })

    this.event.emit('user:registration', { user: user.$attributes })
    return user
  }

  /**
   *
   *
   * @param {*} where
   * @returns {(Promise<User|null>)}
   * @memberof UserRepository
   */
  public async findOne (where: any): Promise<User|null> {
    return await User.query().where(where).first()
  }

  public async findOneWithToken (where: any): Promise<User|null> {
    return await User
      .query()
      .preload('token', (builder) => builder.where({ isRevoked: false }))
      .where(where)
      .first()
  }

  /**
   *
   *
   * @param {User} user
   * @memberof UserRepository
   */
  public async activateAccount (user: User) {
    user.activeToken = ''
    user.active = true
    await user.save()
  }

  /**
   *
   *
   * @param {User} user
   * @param {string} password
   * @memberof UserRepository
   */
  public async recoverChangeAccount (user: User, password: string) {
    user.activeToken = ''
    user.password = await Hash.hash(password)
    await user.save()
  }

  /**
   *
   *
   * @param {string} email
   * @param {string} password
   * @returns
   * @memberof UserRepository
   */
  public async authorize (email: string, password: string) {
    const user = await this.findOne({ email }) as User
    if (!user) {
      throw new ErrorException('I18n(error:auth.authorize)')
    }

    if (!await Hash.verify(user.password, password)) {
      throw new ErrorException('I18n(error:auth.authorize)')
    }

    return user
  }

  /**
   *
   *
   * @param {User} user
   * @memberof UserRepository
   */
  public async recoverAccount (user: User) {
    user.activeToken = await GenerateToken([user.username, user.email])
    await user.save()

    this.event.emit('user:recover', { user: user.$attributes })
  }
}

export default new UserRepository(Event)
