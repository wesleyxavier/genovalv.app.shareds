#!/bin/sh
# Falha cedo e com mensagem clara se o certificado local nao existir (nao sobe sem TLS).
set -eu

for f in tls.crt tls.key; do
  if [ ! -s "/etc/nginx/certs/$f" ]; then
    echo "[edge] ERRO: certificado ausente em /etc/nginx/certs ($f). Execute: docker compose run --rm edge-certs-init" >&2
    exit 1
  fi
done

# diretorio de saida do envsubst (precisa existir e ser gravavel)
mkdir -p /etc/nginx/edge.d

exec /docker-entrypoint.sh nginx -g 'daemon off;'
