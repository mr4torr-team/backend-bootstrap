import { EventsList } from '@ioc:Adonis/Core/Event'

import MailService, { SendLanguageType } from 'App/Services/MailService'
import mailConfig from 'Config/mail'
import User from 'App/Models/User'

export default class UserListener {
  protected send (user: User, template: string) {
    MailService.send({
      to: user.email,
      language: user.locale as SendLanguageType,
      template: template,
      locals: {
        ...user,
        link: `${mailConfig.domain}/${template.replace(/\./g, '/')}?token=${user.activeToken}&lang=${user.locale}`,
      },
    })
  }

  public registration (data: EventsList['user:registration']) {
    const user = data.user as User
    this.send(user, 'auth.registration')
  }

  public recover (data: EventsList['user:recover']) {
    const user = data.user as User
    this.send(user, 'auth.recover')
  }
}
