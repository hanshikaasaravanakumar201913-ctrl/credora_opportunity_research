@echo off
title Credora - Frontend Web App (Port 5173)
cd /d "%~dp0frontend"
echo ===================================================
echo Starting Credora Frontend Web App on Port 5173...
echo ===================================================
node .\node_modules\vite\bin\vite.js
pause
