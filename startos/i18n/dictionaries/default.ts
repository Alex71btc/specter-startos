export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Jam!': 0,
  'no store': 1,
  'Web Interface': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,
  'Web UI': 5,
  'The web interface of Jam': 6,
  'Reset Password': 7,
  'Create Password': 8,
  'Reset your Jam password': 9,
  'Create your Jam password': 10,
  'Success': 11,
  'Your password has been reset. Use the credentials below to log in.': 12,
  'Username': 13,
  'Password': 14,
  'Jam needs an RPC user in Bitcoin': 15,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
