export declare module 'Config/mail' {
  export type DriverType = 'sendgrid' | 'mailtrap'

  export type ConfigDriverType = {
    driver: DriverType;
    apiKey?: string;
    from?: string;
    port?: string;
    host?: string;
    secure?: boolean;
    auth?: map;
  }

  export type ConfigType = {
    connection: string;
    domain: string;
    sendgrid?: ConfigDriverType;
    mailtrap?: ConfigDriverType;
  }
}
