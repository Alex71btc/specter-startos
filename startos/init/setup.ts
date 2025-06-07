import { selectNode } from '../actions/selectNode'
import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInstall(async (effects) => {
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'specter' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/root',
      readonly: false,
    }),
    'specter-init',
    async (sub) => {
      await sub.spawn([
        'python3',
        '-m',
        'cryptoadvance.specter',
        'server',
        '--host',
        '0.0.0.0',
      ])

      let cfgExists = false
      for (let i = 0; i < 10 && !cfgExists; i++) {
        await new Promise((resolve) => setTimeout(resolve, 4000))
        cfgExists = !!(await configJson.read().once())
        if (cfgExists) break
      }
      if (!cfgExists) throw new Error('Failed to initialize Specter')
    },
  )

  await sdk.action.createOwnTask(effects, selectNode, 'critical', {
    reason:
      'Decide whether Specter will use Bitcoin or electrs. This can be changed later.',
  })
})
