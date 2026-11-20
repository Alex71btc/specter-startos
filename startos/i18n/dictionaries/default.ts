export const DEFAULT_LANG = 'en_US'

const dict = {
  // interfaces.ts
  'Web UI': 1,
  'The web interface of Specter': 2,

  // main.ts
  'Web Interface': 10,
  'The web interface is ready': 11,
  'The web interface is not ready': 12,

  // actions/selectNode.ts — input spec
  Node: 20,
  '- Bitcoin RPC: Specter talks to your Bitcoin node directly, with no indexer. Importing or rescanning a wallet walks the block range.\n- Spectrum Node: Specter queries an Electrum server, Fulcrum or electrs, which indexes addresses, so wallet imports and rescans are faster. It is experimental and currently less reliable than Bitcoin RPC.': 21,
  'Bitcoin RPC (recommended)': 22,
  'Spectrum Node (experimental)': 23,
  'Spectrum Backend': 24,
  'The chosen server must be installed and synced before Specter starts.\n- Fulcrum: Spectrum Node queries the Fulcrum service\n- electrs: Spectrum Node queries the electrs service': 25,
  Fulcrum: 26,
  electrs: 27,

  // actions/selectNode.ts — metadata and results
  'Select Node': 28,
  'Choose the Bitcoin backend for Specter': 29,
  Success: 30,
  'Spectrum Node selected and configured with Fulcrum.': 31,
  'Spectrum Node selected and configured with electrs.': 32,
  'Bitcoin RPC is already configured. Existing RPC credentials were reused.': 33,
  'Specter needs dependency-scoped Bitcoin RPC credentials.': 34,
  'Bitcoin RPC selected and new RPC credentials were generated for Specter.': 35,

  // init/promptSelectNode.ts
  'Please choose which backend Specter should use.': 40,

  // actions/resetPassword.ts
  'Reset Admin Password': 50,
  'Create Admin Password': 51,
  'Generate a new password for the Specter admin account': 52,
  'Generate the password for the Specter admin account': 53,
  'Replaces the current admin password and restarts Specter if it is running. Swan credentials Specter stored under the old password are erased.': 54,
  'Your Specter admin password is below. Save it to a password manager. Specter asks for the username only if it is set to sign in with username and password.': 55,
  Username: 56,
  Password: 57,

  // init/taskAdminPassword.ts
  'Create a password to sign in to Specter': 60,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
