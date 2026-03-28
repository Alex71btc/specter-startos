FROM ghcr.io/cryptoadvance/specter-desktop:v2.1.5

USER root

RUN apt update && apt install -y curl jq \
 && curl -sS https://webi.sh/yq | sh \
 && mv /root/.local/bin/yq /usr/local/bin/yq \
 && apt clean \
 && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
