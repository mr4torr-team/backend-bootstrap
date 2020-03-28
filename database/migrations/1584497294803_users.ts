import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected $tableName = 'users'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    this.schema.createTable(this.$tableName, async (table) => {
      table.uuid('id').notNullable().primary()
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('locale').notNullable().defaultTo('pt_BR')
      table.string('time_zone').notNullable().defaultTo('America/Sao_Paulo')
      table.boolean('is_admin').defaultTo(false)
      table.string('active_token')
      table.boolean('active').defaultTo(false)
      table.timestamps(true)
    })

    this.schema.raw('ALTER TABLE ' + this.$tableName + ' ALTER id SET DEFAULT uuid_generate_v4()')
  }

  public async down () {
    this.schema.dropTable(this.$tableName)
  }
}
