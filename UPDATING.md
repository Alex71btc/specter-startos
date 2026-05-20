# Updating the upstream version

Specter Desktop has one upstream source: the `ghcr.io/cryptoadvance/specter-desktop` Docker image, whose tags follow the GitHub release version. Bumping the package is a single field change.

## Determining the upstream version

- **Specter Desktop** ([`cryptoadvance/specter-desktop`](https://github.com/cryptoadvance/specter-desktop)) — latest GitHub release:

  ```sh
  gh release view -R cryptoadvance/specter-desktop --json tagName -q .tagName
  ```

  The matching container tag is published to GHCR as `ghcr.io/cryptoadvance/specter-desktop:<tagName>` (the GitHub tags themselves already carry a `v` prefix, e.g. `v2.1.8`). The pin lives in `images.specter.source.dockerTag` in `startos/manifest/index.ts`.

## Applying the bump

- **`startos/manifest/index.ts`** — set `images.specter.source.dockerTag` to `ghcr.io/cryptoadvance/specter-desktop:<tagName>` using the tag from the command above.
