import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  active_node_alias: z.union([
    z.literal('bitcoin_core'),
    z.literal('spectrum_node'),
    z.null(),
  ]).catch(null),
  spectrum_backend: z.union([
    z.literal('electrs'),
    z.literal('fulcrum'),
    z.null(),
  ]).catch(null),
  bitcoind: z.boolean().catch(false),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.specter/config.json' },
  shape,
)
