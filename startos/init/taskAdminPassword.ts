import { resetPassword } from '../actions/resetPassword'
import { configJson } from '../fileModels/config.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { lockedAdminPassword, setAdminPassword } from '../utils'

export const taskAdminPassword = sdk.setupOnInit(async (effects) => {
  const isSet = await storeJson.read((s) => s.adminPasswordSet).const(effects)
  if (isSet) return

  if (isSet == null) {
    const method = await configJson.read((c) => c.auth?.method).once()
    if (method && method !== 'none') {
      await storeJson.merge(effects, { adminPasswordSet: true })
      return
    }
    // Specter's own first-start admin password is "admin", so no known password is left in place.
    await setAdminPassword(effects, lockedAdminPassword())
    await configJson.merge(effects, { auth: { method: 'passwordonly' } })
    await storeJson.merge(effects, { adminPasswordSet: false })
  }

  await sdk.action.createOwnTask(effects, resetPassword, 'important', {
    reason: i18n('Create a password to sign in to Specter'),
  })
})
