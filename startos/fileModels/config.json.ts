import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  active_node_alias: z.literal('bitcoin_core').nullable().catch(null),
  bitcoind: z.boolean().catch(false),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.specter/config.json' },
  shape,
)
