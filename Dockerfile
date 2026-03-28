FROM python:3.11-slim

USER root

RUN apt update && apt install -y \
    git curl jq build-essential \
    libffi-dev libssl-dev libjpeg-dev zlib1g-dev \
 && curl -sS https://webi.sh/yq | sh \
 && mv /root/.local/bin/yq /usr/local/bin/yq \
 && apt clean \
 && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

WORKDIR /opt

RUN git clone --branch v2.1.5 --depth 1 https://github.com/cryptoadvance/specter-desktop.git

WORKDIR /opt/specter-desktop

RUN pip install --no-cache-dir --upgrade "pip<26" "setuptools<82" wheel \
 && pip install --no-cache-dir -r requirements.txt \
 && pip install --no-cache-dir . \
 && python3 -c "import pkg_resources"

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
