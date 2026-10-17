@echo off
title ZERO TO ONE - Ralph Loop Runner
cd /d "%~dp0"
echo ========================================================
echo  ZERO TO ONE - Ralph Loop Autonomous AI Runner
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File .\ralph.ps1 %*
if %ERRORLEVEL% neq 0 (
    echo.
    echo Running via Node.js fallback runner...
    node ralph.js %*
)
pause
