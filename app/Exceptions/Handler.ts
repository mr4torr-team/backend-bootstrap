/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import getError from '../../errors'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error: any, ctx: any) {
    const code: number = parseInt(error.errno ?? error.code)

    const _error: any = getError(code, ctx.lang)
    if (_error) {
      return ctx.response.status(_error.status ?? 500).send(_error.validate)
    } else if (error.validate !== undefined) {
      return ctx.response.status(error.status ?? 422).send(error.validate)
    } else if (error.name === 'error') {
      return ctx.response.status(500).send({
        error: parseInt(error.errno ?? error.code),
        key: error.constraint,
      })
    }

    return super.handle(error, ctx)
  }
}
