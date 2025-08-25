# 🚀 Quick Start Guide

Get your car rental application up and running in 10 minutes!

## Option 1: Automated Setup (Recommended)

Run the setup script from the project root:
```bash
./setup.sh
```

This will automatically:
- Check system requirements
- Set up the backend virtual environment
- Install all dependencies
- Create environment files
- Provide next steps

## Option 2: Manual Setup

### 1. Prerequisites
- Node.js 16+
- Python 3.8+
- Supabase account

### 2. Database Setup (5 minutes)
1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Copy the SQL from `database_schema.md` into the SQL Editor
4. Run the scripts to create tables and policies
5. (Optional) Insert sample data

### 3. Backend Setup (2 minutes)
```bash
cd Car-rental-Service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
python app.py
```

### 4. Frontend Setup (2 minutes)
```bash
cd car-rental-frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
```

### 5. Access Your App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables Needed

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SECRET_KEY=your_secret_key
```

### Frontend (.env)
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Create Admin User

After signing up through the frontend:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user and edit user metadata
3. Add: `{"role": "admin"}`

## 🎉 You're Ready!

Your car rental application is now running with:
- ✅ User authentication
- ✅ Vehicle browsing and filtering
- ✅ Booking system
- ✅ Admin dashboard
- ✅ Responsive design

## Need Help?

- 📖 Check the main [README.md](./README.md) for detailed documentation
- 🗃️ Review [database_schema.md](./database_schema.md) for database setup
- 🔧 Backend docs: [Car-rental-Service/README.md](./Car-rental-Service/README.md)
- 🎨 Frontend docs: [car-rental-frontend/README.md](./car-rental-frontend/README.md)
