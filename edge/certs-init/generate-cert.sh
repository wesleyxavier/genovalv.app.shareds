#!/bin/sh
# Gera certificado autoassinado de desenvolvimento para *.${EDGE_BASE_DOMAIN}.
# Idempotente: mantém o certificado se existir, estiver válido (>24h) e cobrir o domínio.
set -eu

DIR=/certs
DOMAIN="${EDGE_BASE_DOMAIN:-genova.localhost}"
DAYS="${EDGE_CERT_DAYS:-825}"

mkdir -p "$DIR"

if [ -s "$DIR/tls.crt" ] && [ -s "$DIR/tls.key" ] \
  && openssl x509 -in "$DIR/tls.crt" -noout -checkend 86400 >/dev/null 2>&1 \
  && openssl x509 -in "$DIR/tls.crt" -noout -ext subjectAltName 2>/dev/null | grep -qF "DNS:*.$DOMAIN"; then
  echo "[edge-certs] certificado valido encontrado, mantendo"
  exit 0
fi

echo "[edge-certs] gerando certificado autoassinado para *.$DOMAIN ($DAYS dias)"
openssl req -x509 -nodes -newkey rsa:2048 -days "$DAYS" \
  -keyout "$DIR/tls.key" -out "$DIR/tls.crt" \
  -subj "/CN=*.$DOMAIN" \
  -addext "subjectAltName=DNS:*.$DOMAIN,DNS:$DOMAIN"
echo "[edge-certs] pronto"
