import { FileHelper, T, z } from '@start9labs/start-sdk'
import { createHash, pbkdf2Sync, randomBytes } from 'node:crypto'
import {
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
} from 'bitcoin-core-startos/startos/utils'
import {
  electrumHostId as electrsHostId,
  port as electrsPort,
} from 'electrs-startos/startos/utils'
import {
  electrumPort as fulcrumPort,
  mainHostId as fulcrumHostId,
} from 'fulcrum-startos/startos/utils'
import { PasswordHash, usersJson } from './fileModels/users.json'
import { sdk } from './sdk'

export const uiPort = 25441

// bitcoind's RPC binding, taken from the dependency's own exports so the
// bridge lookup tracks its source of truth (host id + internal port).
export const btcRpcBinding = {
  packageId: 'bitcoind',
  hostId: btcRpcHostId,
  internalPort: btcRpcPort,
  ssl: false,
} as const

// The selected Electrum backend's binding, keyed by packageId (which doubles
// as the backend name). electrs binds its Electrum server on the 'electrum'
// host, Fulcrum on 'main'; both listen plaintext on 50001, reachable over the
// bridge as the ssl=false variant that Spectrum Node dials.
export const electrumBinding = {
  electrs: {
    packageId: 'electrs',
    hostId: electrsHostId,
    internalPort: electrsPort,
    ssl: false,
  },
  fulcrum: {
    packageId: 'fulcrum',
    hostId: fulcrumHostId,
    internalPort: fulcrumPort,
    ssl: false,
  },
} as const

const newSalt = () =>
  createHash('sha256').update(randomBytes(60)).digest('base64')

// Specter's own scheme (cryptoadvance/specter/user.py hash_password): PBKDF2-SHA256, 10000 rounds, keyed on the salt's base64 text.
export const hashAdminPassword = (password: string): PasswordHash => {
  const salt = newSalt()
  return {
    salt,
    pwdhash: pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('base64'),
  }
}

export const lockedAdminPassword = (): PasswordHash => ({
  salt: newSalt(),
  pwdhash: randomBytes(32).toString('base64'),
})

// The user secret is encrypted under the old password, so it and the Swan data under it are discarded, as Specter does itself.
export const setAdminPassword = async (
  effects: T.Effects,
  password: PasswordHash,
) => {
  const users = (await usersJson.read().once()) ?? []
  const admin = users.find((u) => u.is_admin)
  const updated = {
    ...(admin ?? { id: 'admin', username: 'admin', is_admin: true }),
    password,
    encrypted_user_secret: null,
  }
  await usersJson.write(
    effects,
    admin ? users.map((u) => (u === admin ? updated : u)) : [updated],
  )
  if (admin?.encrypted_user_secret) {
    await FileHelper.json(
      {
        base: sdk.volumes.main,
        subpath: `.specter/${updated.username}_services.json`,
      },
      z.looseObject({}),
    ).write(effects, {})
  }
  return updated.username
}
