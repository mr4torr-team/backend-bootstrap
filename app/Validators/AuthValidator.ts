import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import ValidatorAbstract from './ValidatorAbstract'

class AuthValidator extends ValidatorAbstract {
  /**
   * Using a pre-compiled schema you can validate the "shape", "type",
   * "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ inTable: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = validator.compile(schema.create({
    email: schema.string({}, [
      rules.email(),
      //rules.unique({ inTable: 'users', column: 'email' }),
    ]),
    username: schema.string(),
    password: schema.string(),
  }))

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
  */
  public messages = {
    'email.required': 'validation:base.required',
    'email.email': 'validation:base.email',
    'username.required': 'validation:base.required',
    'password.required': 'validation:base.required',
  }
}

export default new AuthValidator()
