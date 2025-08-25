# Car Rental Application Setup Script for Windows
Write-Host "Setting up Car Rental Application for Windows..." -ForegroundColor Green

# Backend Setup
Write-Host "`n[1/3] Setting up Backend..." -ForegroundColor Yellow
Set-Location "Car-rental-Service"
Write-Host "Creating virtual environment..."
python -m venv venv
Write-Host "Activating virtual environment..."
& "venv\Scripts\Activate.ps1"
Write-Host "Installing Python dependencies..."
pip install -r requirements.txt
Write-Host "Backend setup complete!" -ForegroundColor Green

# Frontend Setup
Write-Host "`n[2/3] Setting up Frontend..." -ForegroundColor Yellow
Set-Location "..\car-rental-frontend"
Write-Host "Installing Node.js dependencies..."
npm install
Write-Host "Frontend setup complete!" -ForegroundColor Green

# Instructions
Write-Host "`n[3/3] Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up environment variables in both .env files"
Write-Host "2. Run start-backend.ps1 to start the Flask server"
Write-Host "3. Run start-frontend.ps1 to start the React app"
Write-Host "`nSetup complete!" -ForegroundColor Green

Read-Host "Press Enter to continue"
