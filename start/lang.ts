import i18next from 'i18next'
import postProcessor from 'i18next-sprintf-postprocessor'
import i18nConfig from 'Config/i18n'

const resources = {}
i18nConfig.languages.forEach((lng: string) => {
  resources[lng] = require('../locales/' + lng).default
})

i18next.use(postProcessor).init({ ...i18nConfig, resources }, (err: any) => {
  if (err) {
    console.log('start/lang.ts:12', err)
    throw('Error load content translate')
  }
})

export default i18next
