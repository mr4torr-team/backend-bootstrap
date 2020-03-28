/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  // Route.get('/email/send', 'EmailController.view')
  // Route.get('/email/view', 'EmailController.view')

  /**
  * @api {post} /oauth/confirmation
  *
  * @param {string} token
  */
  Route.put('/oauth/confirmation', 'AuthController.confirmation')

  /**
   * @api {post} /oauth/register
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
  */
  Route.post('/oauth/register', 'AuthController.store')

  /**
  * @api {post} /oauth/recover
  *
  * @param {string} email
  */
  Route.post('/oauth/recover', 'AuthController.recover')

  /**
  * O Obsetivo é poder alterar a senha junto com um token valido
  * @api {put} /oauth/recover
  *
  * @param {string} token
  * @param {string} password
  */
  Route.put('/oauth/recover', 'AuthController.recoverChangePassword')

  /**
  *
  * @api {post} /oauth/authorize
  *
  * @param {string} email
  * @param {string} password
  */
  Route.post('/oauth/authorize', 'AuthController.authorize')

  Route.group(() => {
    /**
    *
    * @api {post} /oauth/renew
    *
    * @param {string} secret
    */
    Route.post('/oauth/renew', 'AuthController.renew')

    /**
    *
    * @api {post} /oauth/revoke
    *
    * @param {string} secret
    */
    Route.delete('/oauth/revoke', 'AuthController.revoke')
  }).middleware(['auth'])

  Route.get('health', async ({ response }) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
  })
}).prefix('v1')
