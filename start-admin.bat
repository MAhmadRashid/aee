@echo off
title ZERO TO ONE - Atelier Admin Suite (Port 3001)
cd /d "%~dp0"
echo ========================================================
echo  ZERO TO ONE - Atelier Admin Suite (Port 3001)
echo  Admin URL: http://localhost:3001/admin
echo ========================================================
start http://localhost:3001/admin
cmd /c npm run dev:admin
pause
