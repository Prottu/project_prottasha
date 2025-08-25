# Car Rental Service - Flask Backend

This is the Flask backend API for the Car Rental application. It provides RESTful endpoints for vehicle management, booking operations, and admin functionality.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Supabase account and project

### Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd Car-rental-Service
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SECRET_KEY=your_secret_key_here
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## 📋 API Documentation

### Health Check
- **GET** `/` - API status check
- **GET** `/api/health` - Detailed health check with timestamp

### Vehicles

#### Get All Vehicles
- **GET** `/api/vehicles`
- **Query Parameters:**
  - `type` (optional): Filter by vehicle type (Sedan, SUV, Truck, etc.)
  - `transmission` (optional): Filter by transmission (Automatic, Manual)
  - `min_price` (optional): Minimum price per day
  - `max_price` (optional): Maximum price per day

**Example Request:**
```bash
curl "http://localhost:5000/api/vehicles?type=SUV&min_price=50"
```

**Response:**
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "make": "Honda",
      "model": "CR-V",
      "year": 2023,
      "type": "SUV",
      "transmission": "Automatic",
      "fuel_type": "Gasoline",
      "seats": 5,
      "price_per_day": 65.00,
      "image_url": "https://example.com/image.jpg",
      "is_available": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "status": "success"
}
```

#### Get Vehicle by ID
- **GET** `/api/vehicles/<vehicle_id>`

### Bookings (Protected Routes)

#### Create Booking
- **POST** `/api/bookings`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:**
```json
{
  "vehicle_id": "uuid",
  "start_date": "2024-01-15",
  "end_date": "2024-01-20"
}
```

#### Get User's Bookings
- **GET** `/api/my-bookings`
- **Headers:** `Authorization: Bearer <jwt_token>`

#### Cancel Booking
- **PATCH** `/api/bookings/<booking_id>/cancel`
- **Headers:** `Authorization: Bearer <jwt_token>`

### Admin Routes (Admin Only)

#### Add Vehicle
- **POST** `/api/admin/vehicles`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`
- **Body:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "type": "Sedan",
  "transmission": "Automatic",
  "fuel_type": "Gasoline",
  "seats": 5,
  "price_per_day": 45.00,
  "image_url": "https://example.com/image.jpg",
  "is_available": true
}
```

#### Update Vehicle
- **PUT** `/api/admin/vehicles/<vehicle_id>`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### Delete Vehicle
- **DELETE** `/api/admin/vehicles/<vehicle_id>`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### Get All Bookings
- **GET** `/api/admin/bookings`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

## 🔐 Authentication

The API uses JWT tokens from Supabase for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Regular User**: Can create and manage their own bookings
- **Admin**: Can manage vehicles and view all bookings

Admin role is determined by the `user_metadata.role` field in the JWT token.

## 🏗 Project Structure

```
Car-rental-Service/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── auth.py             # Authentication decorators
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔧 Configuration

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin operations) | Yes |
| `SECRET_KEY` | Flask secret key for sessions | Yes |

## 🔒 Security Features

- **JWT Validation**: All protected routes validate Supabase JWT tokens
- **Role-based Access Control**: Admin routes check for admin role
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for cross-origin requests
- **SQL Injection Prevention**: Using Supabase client prevents SQL injection
- **Date Validation**: Prevents booking in the past or invalid date ranges

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "status": "error"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Manual Testing with curl

**Test vehicle listing:**
```bash
curl http://localhost:5000/api/vehicles
```

**Test authenticated request (replace with actual token):**
```bash
curl -H "Authorization: Bearer <your_token>" \
     http://localhost:5000/api/my-bookings
```

**Test booking creation:**
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <your_token>" \
     -d '{"vehicle_id":"uuid","start_date":"2024-01-15","end_date":"2024-01-20"}' \
     http://localhost:5000/api/bookings
```

## 🚀 Deployment

### Development
```bash
python app.py
```

### Production
For production deployment, consider using:
- **Gunicorn**: `gunicorn app:app`
- **uWSGI**: `uwsgi --http :5000 --module app:app`

### Environment Setup for Production
1. Set `FLASK_ENV=production`
2. Use a strong `SECRET_KEY`
3. Configure proper CORS origins
4. Set up logging
5. Use environment-specific Supabase keys

### Deployment Platforms
- **Heroku**: Add `Procfile` with `web: gunicorn app:app`
- **Railway**: Automatic deployment from repository
- **DigitalOcean App Platform**: Configure build and run commands
- **AWS Lambda**: Use Zappa or similar for serverless deployment

## 📝 Dependencies

- **Flask**: Web framework
- **Flask-CORS**: Cross-origin resource sharing
- **supabase**: Python client for Supabase
- **python-dotenv**: Environment variable management
- **python-dateutil**: Date parsing utilities

## 🔄 Development Workflow

1. Make changes to the code
2. Test endpoints manually or with automated tests
3. Ensure proper error handling
4. Update documentation if needed
5. Commit changes with descriptive messages

## 🆘 Troubleshooting

### Common Issues

**1. Import errors:**
- Ensure virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

**2. Supabase connection errors:**
- Verify environment variables are set correctly
- Check Supabase project URL and keys
- Ensure database tables exist

**3. Authentication errors:**
- Verify JWT token is valid and not expired
- Check token format in Authorization header
- Ensure user has proper role for admin endpoints

**4. CORS errors:**
- Check Flask-CORS configuration
- Verify frontend URL is allowed

### Debug Mode

Run with debug mode for development:
```bash
export FLASK_ENV=development
python app.py
```

This enables:
- Automatic reloading
- Detailed error messages
- Debug toolbar

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Supabase Python Client](https://supabase.com/docs/reference/python/)
- [JWT Tokens](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Need help?** Check the main project README or create an issue in the repository.
