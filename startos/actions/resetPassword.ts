import { utils } from '@start9labs/start-sdk'
import { configJson } from '../fileModels/config.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { hashAdminPassword, setAdminPassword } from '../utils'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const isSet = await storeJson.read((s) => s.adminPasswordSet).const(effects)
    return {
      name: isSet
        ? i18n('Reset Admin Password')
        : i18n('Create Admin Password'),
      description: isSet
        ? i18n('Generate a new password for the Specter admin account')
        : i18n('Generate the password for the Specter admin account'),
      warning: isSet
        ? i18n(
            'Replaces the current admin password and restarts Specter if it is running. Swan credentials Specter stored under the old password are erased.',
          )
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })
    const username = await setAdminPassword(
      effects,
      hashAdminPassword(password),
    )
    if (
      (await configJson.read((c) => c.auth?.method).once()) !==
      'usernamepassword'
    ) {
      await configJson.merge(effects, { auth: { method: 'passwordonly' } })
    }
    await storeJson.merge(effects, { adminPasswordSet: true })
    await sdk.restart(effects)

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'Your Specter admin password is below. Save it to a password manager. Specter asks for the username only if it is set to sign in with username and password.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
