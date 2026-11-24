@echo off
REM Atalho de duplo clique: liga o painel de Conteudo no site que roda NA VPS.
REM (O www nao e mais servido pela Railway desde 23/11/2026.)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0configurar-conteudo-vps.ps1"
pause
