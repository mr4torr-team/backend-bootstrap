export declare module 'App/Services/MailService' {
  export type SendLanguageType = 'pt_BR' | 'en'

  export type SendType = {
    to: string;
    language: SendLanguageType;
    template: string;
    locals?: {};
  }
}
