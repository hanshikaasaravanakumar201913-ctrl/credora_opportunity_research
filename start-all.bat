@echo off
title Credora Launcher
echo ===================================================
echo   Launching Credora Full-Stack Platform...
echo   "Research. Compare. Verify. Decide."
echo ===================================================
echo.
echo Starting Backend on http://localhost:5000...
start "Credora Backend" cmd /c "%~dp0start-backend.bat"

timeout /t 2 /nobreak >nul

echo Starting Frontend on http://localhost:5173...
start "Credora Frontend" cmd /c "%~dp0start-frontend.bat"

echo.
echo ===================================================
echo   Credora is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
timeout /t 5
