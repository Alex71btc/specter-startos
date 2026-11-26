# Updating the upstream version

Specter Desktop uses the official upstream Docker image
`ghcr.io/cryptoadvance/specter-desktop`.

## Determining the upstream version

Find the latest upstream release:

    gh release view -R cryptoadvance/specter-desktop --json tagName -q .tagName

Inspect the matching container image:

    docker buildx imagetools inspect ghcr.io/cryptoadvance/specter-desktop:<tagName>

Verify that both linux/amd64 and linux/arm64 are available.
Use the multi-architecture index digest, not an individual
platform manifest digest.

## Applying the bump

- Update `images.specter.source.dockerBuild.buildArgs.IMAGE`
  in `startos/manifest/index.ts` using the verified tag and digest:
  `ghcr.io/cryptoadvance/specter-desktop:<tagName>@sha256:<digest>`.
- Preserve the CA-store and certifi refresh in the root Dockerfile.
