import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_1_7_0 = VersionInfo.of({
  version: '2.1.7:0',
  releaseNotes: {
    en_US: 'Initial StartOS 0.4 rebuild for Specter 2.1.7.'
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE
  }
})
