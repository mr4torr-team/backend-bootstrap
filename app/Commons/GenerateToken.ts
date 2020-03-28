import Hash from '@ioc:Adonis/Core/Hash'

const GenerateToken = async (fields: string[]): Promise<string> => {
  const hashLink = await Hash.hash(fields.join(''))
  const token: Buffer = Buffer.from(hashLink, 'utf-8')
  return token.toString('base64')
}

export default GenerateToken
