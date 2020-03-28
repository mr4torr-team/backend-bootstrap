/// <reference path="./mail.d.ts" />

import Env from '@ioc:Adonis/Core/Env'
// import Application from '@ioc:Adonis/Core/Application'

const mailConfig = {
  connection: Env.get('MAIL_DRIVER', 'mailtrap') as string,
  domain: Env.get('MAIN_DOMAIN', 'http://localhost:3333') as string,
  sendgrid: {
    apiKey: Env.get('MAIL_APIKEY', '') as string,
  },
  mailtrap: {
    from: Env.get('MAIL_FROM', 'admin@example.com') as string,
    port: Env.get('MAIL_PORT', '2525') as string,
    host: Env.get('MAIL_HOST', 'smtp.mailtrap.io') as string,
    secure: Env.get('MAIL_SECURE', false) as boolean,
    auth: {
      user: Env.get('MAIL_USERNAME', 'username') as string,
      pass: Env.get('MAIL_PASSWORD', 'password') as string,
    },
  },
}

export default mailConfig
