#!/usr/bin/env bash
#
# Liga o app do atleta (/app) no site que roda NA VPS.
#
# O app precisa de duas coisas em /etc/carefit/site.env:
#   AGENDA_CHAVE   segredo compartilhado com os dois Apps Scripts (fortalecimento e yoga).
#                  Se ainda nao existe, e criado AQUI e mostrado UMA vez no fim, para
#                  colar em Configuracoes do projeto > Propriedades do script > CHAVE_SITE.
#   EVOLUTION_*    as mesmas tres que o painel de Operacao ja usa para ler o WhatsApp.
#                  Este script so confere se estao la: sem elas o codigo de acesso nao sai.
#
# Roda pelo configurar-app-vps.ps1 (do PC). Faz backup do arquivo antes de mexer, recria
# o container e confere no fim. Rodar de novo nao troca a chave que ja existe.
set -euo pipefail

ALVO=/etc/carefit/site.env
APP=/home/carefit/apps/carefit-site
PORTA=http://127.0.0.1:18082

sudo -n test -f "$ALVO" || { echo "nao achei $ALVO"; exit 1; }

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
chmod 600 "$TMP"
sudo -n cat "$ALVO" > "$TMP"

MUDOU=0
CHAVE=$(grep '^AGENDA_CHAVE=' "$TMP" | head -1 | cut -d= -f2- | tr -d '\r' || true)
if [ "${#CHAVE}" -ge 32 ]; then
  echo "AGENDA_CHAVE: ja existia (${#CHAVE} caracteres), mantida"
else
  CHAVE=$(openssl rand -hex 32)
  sed -i '/^AGENDA_CHAVE=/d' "$TMP"
  printf 'AGENDA_CHAVE=%s\n' "$CHAVE" >> "$TMP"
  MUDOU=1
  echo "AGENDA_CHAVE: criada (${#CHAVE} caracteres)"
fi

FALTA=0
for n in EVOLUTION_BASE_URL EVOLUTION_INSTANCE EVOLUTION_API_KEY PORTAL_SESSION_SECRET CLICKUP_API_TOKEN; do
  if grep -q "^$n=." "$TMP"; then echo "$n: presente"; else echo "$n: FALTA"; FALTA=1; fi
done

if [ "$MUDOU" = 1 ]; then
  COPIA="$ALVO.bak-$(date +%Y%m%d-%H%M%S)"
  sudo -n cp -a "$ALVO" "$COPIA"
  echo "backup: $COPIA"
  sudo -n cp "$TMP" "$ALVO"
  sudo -n chown root:root "$ALVO"
  sudo -n chmod 600 "$ALVO"
  echo
  echo "--- recriando o container ---"
  sudo -n docker compose --project-directory "$APP" up -d --force-recreate --wait --wait-timeout 90
fi

echo
echo "--- conferindo ---"
curl -s -o /dev/null -w 'healthz: %{http_code} (200 = site de pe)\n' -m 10 "$PORTA/healthz"
curl -s -o /dev/null -w 'app: %{http_code} (401 = app no ar e protegido; 404 = o codigo do app ainda nao foi publicado)\n' -m 10 "$PORTA/api/app/inicio"

echo
if [ "$FALTA" = 1 ]; then
  echo "ATENCAO: ha variavel faltando acima. Sem as EVOLUTION_* o codigo de acesso nao e enviado."
fi
echo "=================================================================="
echo "Cole este valor nos DOIS Apps Scripts (fortalecimento e yoga), em"
echo "Configuracoes do projeto > Propriedades do script, com o nome CHAVE_SITE:"
echo
echo "$CHAVE"
echo
echo "E um segredo: nao mande por mensagem. Guarde no Bitwarden."
echo "=================================================================="
