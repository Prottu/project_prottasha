# Car Rental Web Application

A complete full-stack car rental application built with React (frontend), Flask (backend), and Supabase (database & authentication).

## 🚗 Features

### User Features
- **User Authentication**: Sign up, login, logout with email/password
- **Browse Vehicles**: View all available cars with filtering options
- **Vehicle Details**: Detailed view of each vehicle with specifications
- **Booking System**: Book vehicles for specific date ranges
- **My Bookings**: View and manage personal bookings
- **Booking Cancellation**: Cancel future bookings

### Admin Features
- **Vehicle Management**: Add, edit, delete vehicles
- **Booking Overview**: View all bookings from all users
- **Admin Dashboard**: Comprehensive management interface

### Technical Features
- **Responsive Design**: Works on all device sizes
- **Real-time Data**: Live updates with Supabase
- **Row Level Security**: Secure data access with RLS policies
- **Date Validation**: Prevents invalid booking dates
- **Price Calculation**: Automatic total price calculation
- **Image Support**: Vehicle image display with fallbacks

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - CSS framework
- **React DatePicker** - Date selection component
- **Supabase JS** - Database and authentication client

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Supabase Python** - Database client
- **Python-dotenv** - Environment variable management

### Database & Authentication
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Database-level security policies
- **JWT Authentication** - Secure token-based authentication

## 📁 Project Structure

```
project_prottasha/
├── Car-rental-Service/          # Flask Backend
│   ├── app.py                   # Main Flask application
│   ├── config.py                # Configuration settings
│   ├── auth.py                  # Authentication decorators
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment variables template
│   └── .gitignore              # Git ignore rules
├── car-rental-frontend/         # React Frontend
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Home.js         # Homepage
│   │   │   ├── Navbar.js       # Navigation
│   │   │   ├── Login.js        # Login form
│   │   │   ├── Signup.js       # Registration form
│   │   │   ├── VehicleList.js  # Vehicle listing
│   │   │   ├── VehicleDetails.js # Vehicle details & booking
│   │   │   ├── MyBookings.js   # User bookings
│   │   │   ├── AdminDashboard.js # Admin panel
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── services/           # API services
│   │   │   └── apiService.js   # Backend API calls
│   │   ├── supabaseClient.js   # Supabase configuration
│   │   ├── App.js              # Main app component
│   │   └── index.js            # App entry point
│   ├── package.json            # Node.js dependencies
│   └── .env.example           # Environment variables template
└── database_schema.md          # Database setup guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Supabase account

### 1. Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Follow the instructions in [`database_schema.md`](./database_schema.md) to:
   - Create the database tables
   - Set up Row Level Security policies
   - Insert sample data (optional)
   - Create admin users

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Car-rental-Service
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SECRET_KEY=your_secret_key_here
   ```

6. Run the Flask server:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd car-rental-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/vehicles` - Get all vehicles with optional filters
- `GET /api/vehicles/<id>` - Get vehicle details

### Protected Endpoints (Require Authentication)
- `POST /api/bookings` - Create a new booking
- `GET /api/my-bookings` - Get current user's bookings
- `PATCH /api/bookings/<id>/cancel` - Cancel a booking

### Admin Endpoints (Require Admin Role)
- `POST /api/admin/vehicles` - Add new vehicle
- `PUT /api/admin/vehicles/<id>` - Update vehicle
- `DELETE /api/admin/vehicles/<id>` - Delete vehicle
- `GET /api/admin/bookings` - Get all bookings

## 👤 User Roles

### Regular User
- Browse and search vehicles
- View vehicle details
- Make bookings
- View and cancel their own bookings

### Admin User
- All regular user features
- Add, edit, delete vehicles
- View all bookings from all users
- Access to admin dashboard

To create an admin user, update the user metadata in Supabase:
```json
{
  "role": "admin"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Row Level Security**: Database-level access control
- **Protected Routes**: Frontend route protection
- **CORS Protection**: Cross-origin request validation
- **Input Validation**: Server-side data validation
- **Admin Authorization**: Role-based access control

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Bootstrap Styling**: Professional UI components
- **Date Picker**: Easy date selection for bookings
- **Real-time Updates**: Live data synchronization
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages
- **Image Fallbacks**: Graceful handling of missing images

## 📱 Screenshots

### Homepage
- Hero section with call-to-action
- Featured vehicles showcase
- Quick search functionality

### Vehicle Listing
- Grid layout with filtering options
- Price and availability information
- Easy navigation to details

### Vehicle Details
- Comprehensive vehicle information
- Interactive booking form
- Price calculation

### Admin Dashboard
- Vehicle management interface
- Booking overview
- Add/edit vehicle forms

## 🚀 Deployment

### Backend Deployment (Flask)
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables in your hosting platform
- Ensure CORS settings allow your frontend domain

### Frontend Deployment (React)
- Build the production version: `npm run build`
- Deploy to platforms like Netlify, Vercel, or AWS S3
- Update `REACT_APP_API_BASE_URL` to your deployed backend URL

### Database (Supabase)
- Already hosted and managed by Supabase
- Ensure your deployment URLs are added to allowed origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the database schema setup in `database_schema.md`
2. Verify environment variables are correctly set
3. Ensure Supabase project is properly configured
4. Check browser console for frontend errors
5. Check Flask logs for backend errors

## 🔮 Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- SMS notifications
- Advanced search filters
- Vehicle reviews and ratings
- Loyalty program
- Multi-language support
- Mobile app (React Native)

---

**Built with ❤️ using React, Flask, and Supabase**
