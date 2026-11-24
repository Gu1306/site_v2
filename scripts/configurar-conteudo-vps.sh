#!/usr/bin/env bash
#
# Liga o painel de Conteudo (/gestao/conteudo) no site que roda NA VPS.
#
# Desde 23/11/2026 o www nao e mais servido pela Railway: ele aponta para esta VPS,
# onde o site e um container (compose em ~/apps/carefit-site) cujos segredos vivem em
# /etc/carefit/site.env. Gravar na Railway nao tem efeito nenhum no site real.
#
# Roda pelo configurar-conteudo-vps.ps1 (do PC), que manda este script por ssh e passa
# pela ENTRADA PADRAO as chaves que so existem no PC, uma por linha, NOME=valor.
# A chave do Postiz e lida aqui mesmo, no banco da propria VPS: nunca viaja.
#
# Faz backup do arquivo antes de mexer, recria o container e confere no fim.
set -euo pipefail

ALVO=/etc/carefit/site.env
APP=/home/carefit/apps/carefit-site
PORTA=http://127.0.0.1:18082

sudo -n test -f "$ALVO" || { echo "nao achei $ALVO"; exit 1; }
COPIA="$ALVO.bak-$(date +%Y%m%d-%H%M%S)"
sudo -n cp -a "$ALVO" "$COPIA"
echo "backup: $COPIA"

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
chmod 600 "$TMP"
sudo -n cat "$ALVO" > "$TMP"

aplicar() { # nome valor
  local n=$1 v=$2
  if [ -z "$v" ] || [ "${#v}" -lt 8 ]; then
    echo "$n: NAO GRAVADA (veio vazia ou curta demais)"
    return 0
  fi
  if grep -q "^$n=" "$TMP"; then sed -i "/^$n=/d" "$TMP"; fi
  printf '%s=%s\n' "$n" "$v" >> "$TMP"
  echo "$n: gravada (${#v} caracteres)"
}

# A chave do Postiz mora no banco do proprio Postiz, aqui na VPS.
PZ=$(sudo -n docker exec postiz-db psql -U postiz -d postiz -At -c 'select "apiKey" from "Organization" limit 1' | tr -d '\r\n')
aplicar POSTIZ_API_KEY "$PZ"

# As demais chegam do PC pela entrada padrao.
while IFS='=' read -r nome valor; do
  valor=${valor%$'\r'}
  [ -n "$nome" ] && aplicar "$nome" "$valor"
done

sudo -n cp "$TMP" "$ALVO"
sudo -n chown root:root "$ALVO"
sudo -n chmod 600 "$ALVO"

echo
echo "--- recriando o container ---"
sudo -n docker compose --project-directory "$APP" up -d --force-recreate --wait --wait-timeout 90

echo
echo "--- conferindo ---"
echo -n "variaveis no container: "
sudo -n docker inspect carefit-site | jq -r '.[0].Config.Env[] | split("=")[0]' | sort | tr '\n' ' '
echo
curl -s -o /dev/null -w 'healthz: %{http_code} (200 = site de pe)\n' -m 10 "$PORTA/healthz"
curl -s -o /dev/null -w 'conteudo: %{http_code} (401 = rota viva e protegida)\n' -m 10 "$PORTA/api/gestao/conteudo"
echo
echo "Se algo der errado, o arquivo anterior esta em $COPIA"
