FROM debian:stable-slim as builder
RUN apt update && apt install -y curl jq
RUN curl -sS https://webi.sh/yq | sh; mv /root/.local/bin/yq /usr/local/bin

RUN apt clean && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

# NEUES IMAGE mit Specter v2.1.1
FROM lncm/specter-desktop:v2.1.1

USER root

COPY --from=builder /usr/local/bin/yq /usr/local/bin/yq
RUN apt update && apt install -y jq

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh

