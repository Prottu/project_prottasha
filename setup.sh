#!/bin/bash

# Car Rental Application Setup Script
# This script helps set up the complete car rental application

echo "🚗 Car Rental Application Setup"
echo "==============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_step "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js $(node -v) found ✓"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    print_status "Python $PYTHON_VERSION found ✓"
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is not installed. Please install pip3."
        exit 1
    fi
    
    print_status "pip3 found ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_status "npm $(npm -v) found ✓"
    echo ""
}

# Setup backend
setup_backend() {
    print_step "Setting up Flask Backend..."
    
    cd Car-rental-Service || {
        print_error "Car-rental-Service directory not found!"
        exit 1
    }
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install Python dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file for backend..."
        cp .env.example .env
        print_warning "Please update the .env file with your Supabase credentials!"
        print_warning "Backend .env file created at: $(pwd)/.env"
    else
        print_status "Backend .env file already exists ✓"
    fi
    
    cd ..
    print_status "Backend setup completed ✓"
    echo ""
}

# Setup frontend
setup_frontend() {
    print_step "Setting up React Frontend..."
    
    cd car-rental-frontend || {
        print_error "car-rental-frontend directory not found!"
        exit 1
    }
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file for frontend..."
        cp .env.example .env
        print_warning "Please update the .env file with your Supabase credentials!"
        print_warning "Frontend .env file created at: $(pwd)/.env"
    else
        print_status "Frontend .env file already exists ✓"
    fi
    
    cd ..
    print_status "Frontend setup completed ✓"
    echo ""
}

# Display next steps
show_next_steps() {
    print_step "Setup completed! Next steps:"
    echo ""
    echo "1. 📋 Database Setup:"
    echo "   - Create a Supabase account at https://supabase.com"
    echo "   - Create a new project"
    echo "   - Follow instructions in database_schema.md to set up tables"
    echo ""
    echo "2. 🔧 Configuration:"
    echo "   - Update Car-rental-Service/.env with your Supabase credentials"
    echo "   - Update car-rental-frontend/.env with your Supabase credentials"
    echo ""
    echo "3. 🚀 Run the application:"
    echo "   Backend (Terminal 1):"
    echo "   cd Car-rental-Service"
    echo "   source venv/bin/activate"
    echo "   python app.py"
    echo ""
    echo "   Frontend (Terminal 2):"
    echo "   cd car-rental-frontend"
    echo "   npm start"
    echo ""
    echo "4. 🌐 Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo ""
    echo "5. 👤 Create an admin user:"
    echo "   - Sign up through the frontend"
    echo "   - In Supabase dashboard, update user metadata with {\"role\": \"admin\"}"
    echo ""
    print_status "Happy coding! 🎉"
}

# Main execution
main() {
    echo "This script will set up both the backend and frontend for the car rental application."
    echo ""
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
    
    echo ""
    check_requirements
    setup_backend
    setup_frontend
    show_next_steps
}

# Run main function
main
