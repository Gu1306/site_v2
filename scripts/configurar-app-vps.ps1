# Liga o app do atleta (/app) no site que roda NA VPS.
#
#   powershell -ExecutionPolicy Bypass -File scripts\configurar-app-vps.ps1
#
# Nenhum segredo sai do PC: a chave da agenda (AGENDA_CHAVE) e criada na propria VPS e
# aparece UMA vez no fim, para colar nos dois Apps Scripts como CHAVE_SITE.
# Rodar de novo e seguro: a chave que ja existe e mantida e mostrada outra vez.
#
# Precisa de: acesso ssh a carefit-vps.

$ErrorActionPreference = 'Stop'

# O script remoto viaja em base64 (o PowerShell 5.1 come aspas ao chamar executavel nativo).
$remoto = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'configurar-app-vps.sh')) -replace "`r`n", "`n"
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($remoto))

Write-Host 'Conferindo a VPS e ligando o app do atleta...' -ForegroundColor Cyan
# Nada de `2>&1` em executavel nativo: no 5.1 cada linha de stderr vira ErrorRecord e,
# com ErrorActionPreference = Stop, mata o script no meio.
try {
  $ErrorActionPreference = 'Continue'
  & ssh -o BatchMode=yes carefit-vps "echo $b64 | base64 -d > /tmp/cfg-app.sh; bash /tmp/cfg-app.sh; r=`$?; rm -f /tmp/cfg-app.sh; exit `$r"
  $codigo = $LASTEXITCODE
} finally { $ErrorActionPreference = 'Stop' }

Write-Host ''
if ($codigo -eq 0) {
  Write-Host 'Pronto. Agora cole a chave acima nos dois Apps Scripts (CHAVE_SITE).' -ForegroundColor Green
} else {
  Write-Host "A VPS devolveu erro (codigo $codigo). Nada foi dado como certo: leia as linhas acima." -ForegroundColor Red
}
