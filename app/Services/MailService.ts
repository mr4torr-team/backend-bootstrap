/// <reference path="./MailService.d.ts" />

import * as fs from 'fs'
import * as nodemailer from 'nodemailer'
import configMail, { ConfigType, DriverType, ConfigDriverType} from 'Config/mail'
import Application from '@ioc:Adonis/Core/Application'
import * as nodemailerSendgrid from 'nodemailer-sendgrid'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'

class MailService {
  private transporter: any
  private driver: DriverType
  private config: ConfigDriverType
  private domain: string

  public to?: string
  public subject?: string
  public message?: string

  private extFile = 'edge'

  constructor (config: ConfigType) {
    this.driver = config.connection as DriverType
    this.config = config[this.driver] as ConfigDriverType
    this.domain = config.domain

    switch (this.driver) {
      case 'mailtrap':
        this.transporter = nodemailer.createTransport({
          debug: false,
          logger: false,
          port: this.getConfig('port'),
          host: this.getConfig('host'),
          secure: this.getConfig('secure'),
          auth: this.getConfig('auth'),
          tls: {
            rejectUnauthorized: false,
          },
        })
        break
      case 'sendgrid':
        this.transporter = nodemailerSendgrid({
          apiKey: this.getConfig('apiKey'),
        })
        break
    }
  }

  private templateExists = (view: string, file: string) => {
    const filePath = `${view}.${file}`.replace(/\./g, '/')

    const fileRealPath = Application.viewsPath(`${filePath}.${this.extFile}`)

    try {
      if (fs.existsSync(fileRealPath)) {
        return filePath
      } else {
        throw new Error(`${filePath}.${this.extFile} was not a file`)
      }
    } catch (err) {
      throw new Error(`${filePath}.${this.extFile} was not a file`)
    }
  }

  private getConfig (name: string) {
    return this.config[name]
  }

  private render (view: string, locals = {}) {
    const pathSubject = this.templateExists(view, 'subject')
    const subject = View.render(pathSubject, locals)

    const pathHtml = this.templateExists(view, 'html')
    const html = View.render(pathHtml, locals)

    const pathText = this.templateExists(view, 'text')
    const text = View.render(pathText, locals)

    return {
      subject,
      html,
      text,
    }
  }

  public send = (data: SendType) => {
    if (!this.transporter) {
      throw new Error('The outgoing email driver has not been defined')
    }
    const _path = [data.template, data.language].join('.')

    const locals = Object.assign({}, data.locals, {
      domain: this.domain,
      application_name: Env.get('APP_NAME'),
      context_name: '&dot; &dot; &dot;',
    })

    const { subject, html, text } = this.render(_path, locals)

    const mailOptions = {
      from: this.getConfig('from') as string,
      to: data.to,
      subject,
      html,
      text,
    }

    this.transporter.sendMail(mailOptions)
  }
}

export default new MailService(configMail as ConfigType)
