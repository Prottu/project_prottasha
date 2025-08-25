#!/bin/bash

# Car Rental Application - Complete Setup and Launch Script
# This script sets up both frontend and backend, installs dependencies, and launches the application

set -e  # Exit on any error

echo "🚗 Car Rental Application - Complete Setup & Launch"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -d "car-rental-frontend" ] || [ ! -d "Car-rental-Service" ]; then
    print_error "Please run this script from the project root directory containing both 'car-rental-frontend' and 'Car-rental-Service' folders"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm (usually comes with Node.js)"
    exit 1
fi

if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3 from https://python.org/"
    exit 1
fi

if ! command_exists pip3; then
    print_error "pip3 is not installed. Please install pip3"
    exit 1
fi

print_success "All prerequisites are installed"

# Get Node.js and Python versions
NODE_VERSION=$(node --version)
PYTHON_VERSION=$(python3 --version)
print_status "Node.js version: $NODE_VERSION"
print_status "Python version: $PYTHON_VERSION"

# Setup Backend (Flask)
print_status "Setting up Flask Backend..."
cd Car-rental-Service

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    print_status "Creating requirements.txt..."
    cat > requirements.txt << EOF
Flask==3.0.0
Flask-CORS==4.0.0
supabase==2.3.4
python-dotenv==1.0.0
python-dateutil==2.8.2
PyJWT==2.8.0
cryptography==41.0.8
EOF
fi

pip install -r requirements.txt
print_success "Python dependencies installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found in backend directory"
    print_status "Creating .env template..."
    cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
EOF
    print_warning "Please update the .env file with your actual Supabase credentials before running the application"
fi

cd ..

# Setup Frontend (React)
print_status "Setting up React Frontend..."
cd car-rental-frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_status "Creating frontend .env file..."
    cat > .env << EOF
# Supabase Configuration for Frontend
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF
    print_warning "Please update the frontend .env file with your actual Supabase credentials"
fi

print_success "Frontend dependencies installed"
cd ..

# Build the application
print_status "Building the application..."

# Ask user if they want to start the services
echo ""
echo "Setup completed successfully! 🎉"
echo ""
echo "Before starting the application, please ensure:"
echo "1. ✅ Supabase project is created and configured"
echo "2. ✅ Database tables are created (run the SQL from database-schema.sql)"
echo "3. ✅ Environment variables are set in both .env files"
echo ""
read -p "Do you want to start the application now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting the Car Rental Application..."
    
    # Start backend in background
    print_status "Starting Flask backend on http://localhost:5000..."
    cd Car-rental-Service
    source venv/bin/activate
    export FLASK_ENV=development
    export FLASK_DEBUG=True
    
    # Start Flask in background
    python app.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting React frontend on http://localhost:3000..."
    cd car-rental-frontend
    
    # Start React development server
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    # Wait a moment for frontend to start
    sleep 5
    
    print_success "Application started successfully!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "To stop the application, press Ctrl+C"
    echo ""
    
    # Function to cleanup processes on exit
    cleanup() {
        print_status "Shutting down application..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Application stopped"
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID
else
    echo ""
    print_status "Application setup complete but not started."
    echo ""
    echo "To start manually:"
    echo "1. Backend: cd Car-rental-Service && source venv/bin/activate && python app.py"
    echo "2. Frontend: cd car-rental-frontend && npm start"
    echo ""
    echo "Or run this script again and choose 'y' to start automatically."
fi

print_success "Setup script completed! 🚀"
