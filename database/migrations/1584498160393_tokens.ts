import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tokens extends BaseSchema {
  protected $tableName = 'tokens'

  public async up () {
    // const uuidRaw = await this.db.rawQuery('select uuid_generate_v4()')

    this.schema.createTable(this.$tableName, async (table) => {
      table.uuid('id').notNullable().primary()
      table.string('token').notNullable().unique()
      table.string('type', 25).notNullable().defaultTo('jwt_refresh_token')
      table.boolean('is_revoked').defaultTo(false)
      table.uuid('user_id').unsigned().references('id').inTable('users')
      table.timestamps(true)
    })

    this.schema.raw('ALTER TABLE ' + this.$tableName + ' ALTER id SET DEFAULT uuid_generate_v4()')
  }

  public async down () {
    this.schema.dropTable(this.$tableName)
  }
}
