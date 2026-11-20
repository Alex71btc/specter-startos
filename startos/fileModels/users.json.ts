import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const passwordHash = z.object({ salt: z.string(), pwdhash: z.string() })

const shape = z.array(
  z.looseObject({
    id: z.string(),
    username: z.string(),
    password: passwordHash,
    is_admin: z.boolean(),
    encrypted_user_secret: z.unknown().optional(),
  }),
)

export const usersJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.specter/users.json' },
  shape,
)

export type PasswordHash = z.infer<typeof passwordHash>
