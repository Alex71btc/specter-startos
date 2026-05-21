import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_1_9_0 = VersionInfo.of({
  version: '2.1.9:0',
  releaseNotes: {
    en_US: 'Update Specter Desktop to v2.1.9.',
    es_ES: 'Actualiza Specter Desktop a v2.1.9.',
    de_DE: 'Aktualisiert Specter Desktop auf v2.1.9.',
    pl_PL: 'Aktualizuje Specter Desktop do v2.1.9.',
    fr_FR: 'Met à jour Specter Desktop vers v2.1.9.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
