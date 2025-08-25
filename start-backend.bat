@echo off
echo Starting Car Rental Backend Server...
cd /d "%~dp0Car-rental-Service"
call venv\Scripts\activate.bat
python app.py
pause
