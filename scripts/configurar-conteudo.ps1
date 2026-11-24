# Liga o painel de Conteúdo (/gestao/conteudo) na Railway.
#
# Pega as quatro chaves direto de onde elas já moram e grava nas variáveis do serviço.
# Nenhum segredo é exibido na tela nem gravado em arquivo: cada valor vai por stdin para o
# Railway CLI. Rode uma vez; para trocar uma chave depois, rode de novo.
#
#   powershell -ExecutionPolicy Bypass -File scripts\configurar-conteudo.ps1
#
# Precisa de: Railway CLI logado (`railway whoami`), acesso ssh à carefit-vps e o
# C:\Projetos\carefit-diretor-tecnologia\.env com as credenciais do n8n.

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

function Set-Var([string]$Nome, [string]$Valor) {
  if ([string]::IsNullOrWhiteSpace($Valor)) { Write-Host "$Nome : NAO ENCONTRADA (pulada)" -ForegroundColor Yellow; return }
  $Valor.Trim() | & railway variables --set-from-stdin $Nome --skip-deploys | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host "$Nome : definida ($($Valor.Trim().Length) caracteres)" -ForegroundColor Green }
  else { Write-Host "$Nome : FALHOU" -ForegroundColor Red }
}

Write-Host 'Lendo a chave do Postiz na VPS...'
$sql = 'select "apiKey" from "Organization" limit 1'
$postiz = & ssh -o BatchMode=yes carefit-vps "sudo -n docker exec postiz-db psql -U postiz -d postiz -At -c '$sql'"

Write-Host 'Lendo a chave do Buffer nas variaveis do Windows...'
$buffer = [Environment]::GetEnvironmentVariable('BUFFER_API_KEY', 'User')

Write-Host 'Lendo as credenciais do n8n...'
$envN8n = @{}
$caminho = 'C:\Projetos\carefit-diretor-tecnologia\.env'
if (Test-Path $caminho) {
  foreach ($linha in Get-Content $caminho) {
    if ($linha -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)$') { $envN8n[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'") }
  }
}

Write-Host ''
Set-Var 'POSTIZ_API_KEY' $postiz
Set-Var 'BUFFER_API_KEY' $buffer
Set-Var 'N8N_BASE_URL'   $envN8n['N8N_BASE_URL']
Set-Var 'N8N_API_KEY'    $envN8n['N8N_API_KEY']

Write-Host ''
Write-Host 'Aplicando: as variaveis so valem depois de um deploy...' -ForegroundColor Cyan
& railway redeploy --yes --from-source
if ($LASTEXITCODE -eq 0) {
  Write-Host ''
  Write-Host 'Pronto. Em uns minutos o painel abre em www.carefitrunbase.com.br/gestao/conteudo' -ForegroundColor Green
} else {
  Write-Host 'As variaveis ficaram gravadas, mas o deploy nao saiu. Rode: railway redeploy' -ForegroundColor Yellow
}
