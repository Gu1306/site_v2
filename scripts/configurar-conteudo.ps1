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

$script:faltaram = @()

function Set-Var([string]$Nome, [string]$Valor) {
  $v = "$Valor".Trim()
  # Uma chave vazia ou uma mensagem de erro do servidor (que tem espaco) nao e chave.
  if ([string]::IsNullOrWhiteSpace($v) -or $v -match '\s') {
    Write-Host "$Nome : NAO LIDA" -ForegroundColor Red
    $script:faltaram += $Nome
    return
  }
  $v | & railway variables --set-from-stdin $Nome --skip-deploys | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host "$Nome : definida ($($v.Length) caracteres)" -ForegroundColor Green }
  else { Write-Host "$Nome : FALHOU ao gravar" -ForegroundColor Red; $script:faltaram += $Nome }
}

Write-Host 'Lendo a chave do Postiz na VPS...'
# O comando vai em base64: o PowerShell 5.1 come as aspas duplas ao passar argumentos para
# um executavel nativo, e sem elas o Postgres procura "organization" em minusculas e falha.
$sql = 'sudo -n docker exec postiz-db psql -U postiz -d postiz -At -c "select \"apiKey\" from \"Organization\" limit 1"'
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($sql))
# Nada de `2>&1` aqui: no 5.1 isso transforma cada linha de stderr do ssh num ErrorRecord e,
# com ErrorActionPreference = Stop, mata o script antes de gravar a chave. Deixar o stderr ir
# para a tela e baixar a guarda so nesta chamada.
$postiz = ''
try {
  $ErrorActionPreference = 'Continue'
  $postiz = (& ssh -o BatchMode=yes carefit-vps "echo $b64 | base64 -d | bash" | Out-String)
} catch {
  Write-Host "ssh falhou: $_" -ForegroundColor Red
} finally {
  $ErrorActionPreference = 'Stop'
}

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
if ($script:faltaram.Count -gt 0) {
  Write-Host ("NAO ENTRARAM: " + ($script:faltaram -join ', ')) -ForegroundColor Red
  Write-Host 'O painel abre, mas sem essas fontes. Resolva e rode de novo.' -ForegroundColor Red
  Write-Host ''
}

Write-Host 'Aplicando: as variaveis so valem depois de um deploy...' -ForegroundColor Cyan
& railway redeploy --yes --from-source
if ($LASTEXITCODE -eq 0) {
  Write-Host ''
  Write-Host 'Pronto. Em uns minutos o painel abre em www.carefitrunbase.com.br/gestao/conteudo' -ForegroundColor Green
} else {
  Write-Host 'As variaveis ficaram gravadas, mas o deploy nao saiu. Rode: railway redeploy' -ForegroundColor Yellow
}
