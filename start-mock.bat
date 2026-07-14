@echo off
SET PORT=8001
cd /d "%~dp0"
node backend\server.mjs
pause
