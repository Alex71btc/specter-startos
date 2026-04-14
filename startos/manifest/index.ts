import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'specter',
  title: 'Specter',
  license: 'mit',
  packageRepo: 'https://github.com/Alex71btc/specter-startos',
  upstreamRepo: 'https://github.com/cryptoadvance/specter-desktop',
  marketingUrl: 'https://specter.solutions',
  donationUrl: null,
  docsUrls: ['https://docs.specter.solutions/'],
  icon: 'icon.png',
  description: {
    short:
      'A user-friendly web interface for Bitcoin wallets, multisig, and hardware wallet workflows.',
    long:
      'Specter Desktop is a Bitcoin wallet interface focused on sovereignty, multisignature setups, and hardware wallet support. This package provides Specter as a StartOS service with a web UI and persistent data storage.'
  },
  volumes: ['main'],
  images: {
    specter: {
      source: {
        dockerTag: 'alex71btc/specter-desktop:v2.1.7'
      },
      arch: ['x86_64', 'aarch64']
    }
  },
dependencies: {
  bitcoind: {
    optional: true,
    description: 'Optional Bitcoin Core / Knots backend for Specter.',
    s9pk: null,
  },
  electrs: {
    optional: true,
    description: 'Optional electrs backend for Specter via Spectrum Node.',
    s9pk: null,
  },
  fulcrum: {
    optional: true,
    description: 'Optional Fulcrum backend for Specter via Spectrum Node.',
    s9pk: null,
  },
}
})
