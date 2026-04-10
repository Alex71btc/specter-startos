import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async () => {
  return {
    bitcoind: {
      kind: 'exists',
      versionRange: '>=29.0',
    },
  }
})
