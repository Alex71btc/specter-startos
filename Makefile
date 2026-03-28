DOC_ASSETS := $(shell find ./docs/assets)
ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
PKG_ID := $(shell yq e ".id" manifest.yaml)
TS_FILES := $(shell find . -name \*.ts )

# delete the target of a rule if it has changed and its recipe exits with a nonzero exit status
.DELETE_ON_ERROR:

all: verify

verify: $(PKG_ID).s9pk
	@echo "Build complete, skipping verification (no longer supported in start-sdk)"
	@echo "   Filesize: $(shell du -h $(PKG_ID).s9pk) is ready"

install: verify
ifeq (,$(wildcard ~/.start9/config.yaml))
	@echo; echo "You must define \"host: http://start-server-name.local\" in ~/.start9/config.yaml config file first"; echo
else
	start-sdk package install $(PKG_ID).s9pk
endif

arm:
	@rm -f docker-images/x86_64.tar
	ARCH=aarch64 $(MAKE)

x86:
	@rm -f docker-images/aarch64.tar
	ARCH=x86_64 $(MAKE)

clean:
	rm -rf docker-images
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js
	rm -f scripts/embassy.js

$(PKG_ID).s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
ifeq ($(ARCH),aarch64)
	@echo "start-sdk: Preparing aarch64 package ..."
else ifeq ($(ARCH),x86_64)
	@echo "start-sdk: Preparing x86_64 package ..."
else
	@echo "start-sdk: Preparing Universal Package ..."
endif
	@start-sdk pack

instructions.md: $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh $(ASSET_PATHS)
ifeq ($(ARCH),aarch64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 --build-arg PLATFORM=amd64 -o type=docker,dest=docker-images/x86_64.tar -f ./Dockerfile .
endif

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh $(ASSET_PATHS)
ifeq ($(ARCH),x86_64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 --build-arg PLATFORM=arm64 -o type=docker,dest=docker-images/aarch64.tar -f ./Dockerfile .
endif

scripts/embassy.js: $(TS_FILES)
	deno bundle -o scripts/embassy.js scripts/embassy.ts

