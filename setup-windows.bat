@echo off
echo Setting up Car Rental Application for Windows...
echo.

echo [1/5] Setting up Backend...
cd Car-rental-Service
echo Creating virtual environment...
python -m venv venv
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt
echo Backend setup complete!
echo.

echo [2/5] Setting up Frontend...
cd ..\car-rental-frontend
echo Installing Node.js dependencies...
npm install
echo Frontend setup complete!
echo.

echo [3/5] Please set up your environment variables:
echo - Copy Car-rental-Service\.env.example to Car-rental-Service\.env
echo - Copy car-rental-frontend\.env.example to car-rental-frontend\.env
echo - Add your Supabase credentials to both files
echo.

echo [4/5] To start the backend server:
echo cd Car-rental-Service
echo venv\Scripts\activate.bat
echo python app.py
echo.

echo [5/5] To start the frontend (in a new terminal):
echo cd car-rental-frontend
echo npm start
echo.

echo Setup complete! Please configure your environment variables before running.
pause
