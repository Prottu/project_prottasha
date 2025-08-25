# Car Rental Application Database Schema

This document outlines the database schema and setup instructions for the car rental application using Supabase.

## Database Tables

### 1. vehicles Table

```sql
CREATE TABLE vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Sedan', 'SUV', 'Truck', 'Convertible', 'Hatchback', 'Coupe')),
    transmission TEXT NOT NULL CHECK (transmission IN ('Automatic', 'Manual')),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Gasoline', 'Diesel', 'Electric', 'Hybrid')),
    seats INTEGER NOT NULL CHECK (seats >= 2 AND seats <= 8),
    price_per_day NUMERIC(10,2) NOT NULL CHECK (price_per_day > 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. bookings Table

```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
    booking_status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (booking_status IN ('Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date > start_date),
    CONSTRAINT future_booking CHECK (start_date >= CURRENT_DATE)
);
```

## Row Level Security (RLS) Policies

### Vehicles Table Policies

```sql
-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read vehicles
CREATE POLICY "Allow public read access" ON vehicles 
FOR SELECT USING (true);

-- Allow admins to manage vehicles
CREATE POLICY "Allow admin insert" ON vehicles 
FOR INSERT WITH CHECK (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

CREATE POLICY "Allow admin update" ON vehicles 
FOR UPDATE USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

CREATE POLICY "Allow admin delete" ON vehicles 
FOR DELETE USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);
```

### Bookings Table Policies

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bookings
CREATE POLICY "Users can read own bookings" ON bookings 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create their own bookings
CREATE POLICY "Users can create own bookings" ON bookings 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own bookings (for cancellation)
CREATE POLICY "Users can update own bookings" ON bookings 
FOR UPDATE USING (auth.uid() = user_id);

-- Allow admins to read all bookings
CREATE POLICY "Admins can read all bookings" ON bookings 
FOR SELECT USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);
```

## Sample Data

### Sample Vehicles

```sql
INSERT INTO vehicles (make, model, year, type, transmission, fuel_type, seats, price_per_day, image_url) VALUES
('Toyota', 'Camry', 2023, 'Sedan', 'Automatic', 'Gasoline', 5, 45.00, 'https://example.com/toyota-camry.jpg'),
('Honda', 'CR-V', 2023, 'SUV', 'Automatic', 'Gasoline', 5, 65.00, 'https://example.com/honda-crv.jpg'),
('Ford', 'F-150', 2023, 'Truck', 'Automatic', 'Gasoline', 5, 85.00, 'https://example.com/ford-f150.jpg'),
('BMW', '3 Series', 2023, 'Sedan', 'Automatic', 'Gasoline', 5, 95.00, 'https://example.com/bmw-3series.jpg'),
('Tesla', 'Model 3', 2023, 'Sedan', 'Automatic', 'Electric', 5, 75.00, 'https://example.com/tesla-model3.jpg'),
('Jeep', 'Wrangler', 2023, 'SUV', 'Manual', 'Gasoline', 4, 70.00, 'https://example.com/jeep-wrangler.jpg'),
('Mercedes-Benz', 'C-Class', 2023, 'Sedan', 'Automatic', 'Gasoline', 5, 105.00, 'https://example.com/mercedes-c-class.jpg'),
('Mazda', 'CX-5', 2023, 'SUV', 'Automatic', 'Gasoline', 5, 60.00, 'https://example.com/mazda-cx5.jpg');
```

## User Roles Setup

To create an admin user, you need to update the user metadata after they sign up:

### Method 1: Using Supabase Dashboard
1. Go to Authentication > Users in your Supabase dashboard
2. Find the user you want to make an admin
3. Click on the user
4. In the "User Metadata" section, add:
```json
{
  "role": "admin"
}
```

### Method 2: Using SQL (Admin Panel)
```sql
UPDATE auth.users 
SET user_metadata = jsonb_set(user_metadata, '{role}', '"admin"')
WHERE email = 'admin@example.com';
```

## Setup Instructions

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the table creation scripts** in the SQL Editor of your Supabase dashboard

3. **Set up RLS policies** by running the policy scripts

4. **Insert sample data** (optional) using the provided INSERT statements

5. **Create admin users** by updating user metadata as described above

6. **Get your API keys**:
   - Go to Settings > API
   - Copy your Project URL and anon/public key
   - For admin operations, you'll also need the service_role key

7. **Update environment variables** in both frontend and backend with your Supabase credentials

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SECRET_KEY=your_secret_key_here
```

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Notes

- The `vehicles` table includes check constraints to ensure data integrity
- The `bookings` table has constraints to prevent invalid date ranges and past bookings
- RLS policies ensure users can only access their own bookings unless they're admins
- Admin role is determined by checking the `user_metadata` field in the JWT token
- All sensitive operations use the service role key for elevated permissions
