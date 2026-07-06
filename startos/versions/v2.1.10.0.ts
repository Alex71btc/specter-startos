import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_1_10_0 = VersionInfo.of({
  version: '2.1.10:0',
  releaseNotes: {
    en_US: 'Update Specter Desktop to v2.1.10.',
    es_ES: 'Actualiza Specter Desktop a v2.1.10.',
    de_DE: 'Aktualisiert Specter Desktop auf v2.1.10.',
    pl_PL: 'Aktualizuje Specter Desktop do v2.1.10.',
    fr_FR: 'Met à jour Specter Desktop vers v2.1.10.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
