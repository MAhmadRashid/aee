@echo off
title ZERO TO ONE - Dual Server Launcher (3000 & 3001)
cd /d "%~dp0"
echo Starting Storefront (port 3000) and Admin Panel (port 3001)...
timeout /t 2 /nobreak >nul
start http://localhost:3000
start http://localhost:3001/admin
node start-all.js
pause
