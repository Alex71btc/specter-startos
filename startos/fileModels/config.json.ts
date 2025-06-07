import { matches, FileHelper } from '@start9labs/start-sdk'
const { object, anyOf, literal } = matches

const shape = object({
  active_node_alias: anyOf(literal('bitcoin_core'), literal('spectrum_node')),
})

export const configJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/.specter/config.json',
  },
  shape,
)
