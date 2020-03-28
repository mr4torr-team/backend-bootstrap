import MailService from 'App/Services/MailService'
import View from '@ioc:Adonis/Core/View'
import Hash from '@ioc:Adonis/Core/Hash'

// Controller para teste de envio de e-mail
export default class EmailController {
  public async view () {
    const user = {
      id: 'a9a4d5b0-6bbf-11ea-b4bc-3c0754428f16',
      username: 'Administrator',
      email: 'admin2@example.com',
      active_token: '',
    }

    const hashLink = await Hash.hash([user.id, user.email].join(''))
    const buff = Buffer.from(hashLink, 'utf8')
    user.active_token = buff.toString('base64')

    return View.render(
      'auth/registration/pt_BR/html',
      {
        ...user,
        link: 'http://localhost:3333/v1/oauth/confirmation/' + user.active_token,
      }
    )
  }

  public async send () {
    const user = {
      id: 'a9a4d5b0-6bbf-11ea-b4bc-3c0754428f16',
      username: 'Administrator',
      email: 'admin2@example.com',
      active_token: '',
    }

    const hashLink = await Hash.hash([user.id, user.email].join(''))
    const buff = Buffer.from(hashLink, 'utf8')
    user.active_token = buff.toString('base64')

    MailService.send({
      to: 'mailontorres@gmail.com',
      language: 'pt_BR',
      template: 'auth.recover',
      locals: {
        ...user,
        link: 'http://localhost:3333/v1/oauth/confirmation/' + user.active_token,
      },
    })

    return [{ id: 1, username: 'virk' }]
  }
}
