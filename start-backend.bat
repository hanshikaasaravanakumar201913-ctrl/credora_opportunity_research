@echo off
title Credora - Backend Server (Port 5000)
cd /d "%~dp0backend"
echo ===================================================
echo Starting Credora Backend Server on Port 5000...
echo ===================================================
node .\node_modules\tsx\dist\cli.mjs watch src/index.ts
pause
