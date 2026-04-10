PACKAGE_ID := specter
ARCH := x86_64

.PHONY: all clean check build pack

all: pack

check:
	npm run check

build:
	npm run build

pack: check build
	start-cli s9pk pack

clean:
	rm -rf javascript
	rm -f *.s9pk
