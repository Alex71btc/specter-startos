import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import {
  bitcoinCoreDefaultConfig,
  bitcoinCoreJson,
} from '../fileModels/bitcoin_core.json'
import {
  spectrumNodeDefaultConfig,
  spectrumNodeJson,
} from '../fileModels/spectrum_node.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await bitcoinCoreJson.write(effects, bitcoinCoreDefaultConfig)
    await spectrumNodeJson.write(effects, spectrumNodeDefaultConfig)
  },
})
