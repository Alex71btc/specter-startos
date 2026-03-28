# ---------- BUILD STAGE ----------
FROM python:3.11-slim AS builder

RUN apt update && apt install -y \
    git build-essential \
    libffi-dev libssl-dev libjpeg-dev zlib1g-dev

WORKDIR /opt

RUN git clone --branch v2.1.5 --depth 1 https://github.com/cryptoadvance/specter-desktop.git

WORKDIR /opt/specter-desktop

RUN pip install --no-cache-dir --upgrade "pip<26" "setuptools<82" wheel \
 && pip install --no-cache-dir -r requirements.txt \
 && pip install --no-cache-dir .


# ---------- FINAL STAGE ----------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1

RUN apt update && apt install -y \
    curl jq libusb-1.0-0 \
 && curl -sS https://webi.sh/yq | sh \
 && mv /root/.local/bin/yq /usr/local/bin/yq \
 && apt clean \
 && rm -rf /var/lib/apt/lists/*

# nur Python packages rüberkopieren
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
