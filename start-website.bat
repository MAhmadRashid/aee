@echo off
title ZERO TO ONE - Boutique Storefront (Port 3000)
cd /d "%~dp0"
echo ========================================================
echo  ZERO TO ONE - Luxury Perfume Boutique Storefront
echo  Local URL: http://localhost:3000
echo ========================================================
start http://localhost:3000
cmd /c npm run dev
pause
