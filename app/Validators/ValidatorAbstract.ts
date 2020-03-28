import { i18n } from 'i18next'

class ValidatorAbstract {
  public messages = {}

  public getMessages (lang?: i18n) {
    if (!lang) {
      return {}
    }

    let _messages = {}
    Object.keys(this.messages).forEach((key: any) => {
      _messages[key] = lang.t(this.messages[key])
    })

    return _messages
  }

  public getMessagesUniq (I18n: i18n, field: string = 'email') {
    // if (!I18n) {
    //   return {}
    // }

    return {
      rule: 'unique',
      field: field,
      message: I18n.t('validation:base.uniq'),
    }
  }
}

export default ValidatorAbstract
