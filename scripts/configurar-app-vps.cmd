@echo off
REM Atalho de duplo clique: liga o app do atleta (/app) no site que roda NA VPS.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0configurar-app-vps.ps1"
pause
