import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  python_class: z.literal('cryptoadvance.specter.node.Node'),
  fullpath: z.literal('/root/.specter/nodes/bitcoin_core.json'),
  name: z.literal('Bitcoin Core'),
  alias: z.literal('bitcoin_core'),
  autodetect: z.literal(false),
  datadir: z.literal(''),
  user: z.string(),
  password: z.string(),
  port: z.literal('8332'),
  host: z.literal('bitcoind.startos').catch('bitcoind.startos'),
  protocol: z.literal('http'),
  node_type: z.literal('BTC'),
})

export const bitcoinCoreJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.specter/nodes/bitcoin_core.json' },
  shape,
)
