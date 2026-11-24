# Liga o painel de Conteudo (/gestao/conteudo) no site que roda NA VPS.
#
# O www nao e mais servido pela Railway desde 23/11/2026 — aponta para a VPS. Entao as
# chaves tem que entrar em /etc/carefit/site.env, la, e nao nas variaveis da Railway.
#
#   powershell -ExecutionPolicy Bypass -File scripts\configurar-conteudo-vps.ps1
#
# Este arquivo so JUNTA as chaves que moram no PC (variavel do Windows e .env do n8n) e
# manda pela entrada padrao do ssh — nunca pela linha de comando, que apareceria no `ps`
# da VPS. A chave do Postiz nem passa por aqui: o script remoto le no banco da propria VPS.
#
# Precisa de: acesso ssh a carefit-vps e C:\Projetos\carefit-diretor-tecnologia\.env.

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host 'Lendo a chave do Buffer nas variaveis do Windows...'
$buffer = [Environment]::GetEnvironmentVariable('BUFFER_API_KEY', 'User')

Write-Host 'Lendo as credenciais do n8n...'
$envN8n = @{}
$caminho = 'C:\Projetos\carefit-diretor-tecnologia\.env'
if (Test-Path $caminho) {
  foreach ($linha in Get-Content $caminho) {
    if ($linha -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)$') { $envN8n[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'") }
  }
} else {
  Write-Host "nao achei $caminho" -ForegroundColor Red
}

$linhas = @()
foreach ($par in @(
  @('BUFFER_API_KEY', $buffer),
  @('N8N_BASE_URL',  $envN8n['N8N_BASE_URL']),
  @('N8N_API_KEY',   $envN8n['N8N_API_KEY'])
)) {
  $v = "$($par[1])".Trim()
  if ([string]::IsNullOrWhiteSpace($v) -or $v -match '\s') {
    Write-Host "$($par[0]) : NAO LIDA no PC" -ForegroundColor Red
  } else {
    Write-Host "$($par[0]) : lida ($($v.Length) caracteres)" -ForegroundColor Green
    $linhas += "$($par[0])=$v"
  }
}

if ($linhas.Count -eq 0) {
  Write-Host 'Nenhuma chave para mandar. Nada foi alterado na VPS.' -ForegroundColor Red
  exit 1
}

# O script remoto viaja em base64 (o PowerShell 5.1 come aspas ao chamar executavel nativo)
# e os valores vao pela entrada padrao, que o bash remoto le linha a linha.
$remoto = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'configurar-conteudo-vps.sh')) -replace "`r`n", "`n"
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($remoto))

Write-Host ''
Write-Host 'Gravando na VPS e recriando o container...' -ForegroundColor Cyan
# Nada de `2>&1` em executavel nativo: no 5.1 cada linha de stderr vira ErrorRecord e,
# com ErrorActionPreference = Stop, mata o script no meio.
try {
  $ErrorActionPreference = 'Continue'
  $linhas -join "`n" | & ssh -o BatchMode=yes carefit-vps "echo $b64 | base64 -d > /tmp/cfg-conteudo.sh; bash /tmp/cfg-conteudo.sh; r=`$?; rm -f /tmp/cfg-conteudo.sh; exit `$r"
  $codigo = $LASTEXITCODE
} finally { $ErrorActionPreference = 'Stop' }

Write-Host ''
if ($codigo -eq 0) {
  Write-Host 'Pronto. Abra www.carefitrunbase.com.br/gestao/conteudo (Ctrl+Shift+R).' -ForegroundColor Green
} else {
  Write-Host "A VPS devolveu erro (codigo $codigo). Nada foi dado como certo: leia as linhas acima." -ForegroundColor Red
}
