import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../../sdk'
import { selectNode } from '../../actions/selectNode'
import { rm } from 'fs/promises'

export const v_2_1_1_1 = VersionInfo.of({
  version: '2.1.1:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await sdk.action.createOwnTask(effects, selectNode, 'critical', {
        reason:
          'Decide whether Specter will use Bitcoin or electrs. This can be changed later.',
      })
      await rm('/data/start9', { recursive: true }).catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
