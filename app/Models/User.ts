import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public email: string

  @column()
  public isAdmin: boolean

  @column()
  public locale: string

  @column()
  public timeZone: string

  @column()
  public activeToken: string

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Token)
  public token: HasOne<Token>
}
