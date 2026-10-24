import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'specter',
  title: 'Specter',
  license: 'mit',
  packageRepo: 'https://github.com/Start9-Community/specter-startos',
  upstreamRepo: 'https://github.com/cryptoadvance/specter-desktop',
  marketingUrl: 'https://specter.solutions',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    specter: {
      source: {
        dockerBuild: {
          buildArgs: { IMAGE: 'ghcr.io/cryptoadvance/specter-desktop:v2.1.11' },
        },
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
