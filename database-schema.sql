-- Car Rental Database Schema
-- Run this in Supabase SQL Editor

-- Enable Row Level Security (RLS)
-- Note: RLS will be enabled on tables individually

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('Economy', 'Compact', 'Mid-size', 'Full-size', 'SUV', 'Luxury', 'Convertible', 'Van')),
    price_per_day DECIMAL(10,2) NOT NULL,
    transmission VARCHAR(10) NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
    fuel_type VARCHAR(15) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
    seats INTEGER NOT NULL,
    image_url VARCHAR(500),
    features TEXT[],
    available BOOLEAN DEFAULT true,
    location VARCHAR(100) DEFAULT 'Main Branch',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    pickup_location VARCHAR(200),
    dropoff_location VARCHAR(200),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint to ensure end_date is after start_date
    CONSTRAINT valid_booking_dates CHECK (end_date >= start_date)
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for vehicles table
-- Policy 1: Everyone can view vehicles
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
    FOR SELECT USING (true);

-- Policy 2: Only admins can insert vehicles
CREATE POLICY "Admins can insert vehicles" ON public.vehicles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy 3: Only admins can update vehicles
CREATE POLICY "Admins can update vehicles" ON public.vehicles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy 4: Only admins can delete vehicles
CREATE POLICY "Admins can delete vehicles" ON public.vehicles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create RLS Policies for bookings table
-- Policy 1: Users can view their own bookings, admins can view all
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy 2: Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own bookings, admins can update all
CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy 4: Users can delete their own bookings, admins can delete all
CREATE POLICY "Users can delete their own bookings" ON public.bookings
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON public.vehicles(available);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price_per_day);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Insert sample vehicles data
INSERT INTO public.vehicles (make, model, year, category, price_per_day, transmission, fuel_type, seats, image_url, features, location) VALUES
('Toyota', 'Corolla', 2023, 'Compact', 35.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', ARRAY['Air Conditioning', 'Bluetooth', 'USB Ports'], 'Main Branch'),
('Honda', 'Civic', 2023, 'Compact', 38.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500', ARRAY['Air Conditioning', 'Bluetooth', 'Backup Camera'], 'Main Branch'),
('Ford', 'Escape', 2023, 'SUV', 55.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500', ARRAY['Air Conditioning', 'AWD', 'Bluetooth', 'Heated Seats'], 'Main Branch'),
('Nissan', 'Altima', 2023, 'Mid-size', 42.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500', ARRAY['Air Conditioning', 'Bluetooth', 'Lane Assist'], 'Main Branch'),
('BMW', 'X3', 2023, 'Luxury', 85.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1555618254-74c8f8c57ab0?w=500', ARRAY['Leather Seats', 'Premium Audio', 'Navigation', 'Heated Seats'], 'Main Branch'),
('Tesla', 'Model 3', 2023, 'Luxury', 75.00, 'Automatic', 'Electric', 5, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500', ARRAY['Autopilot', 'Premium Audio', 'Supercharging'], 'Main Branch'),
('Chevrolet', 'Spark', 2023, 'Economy', 28.00, 'Manual', 'Petrol', 4, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', ARRAY['Air Conditioning', 'USB Ports'], 'Main Branch'),
('Mercedes-Benz', 'C-Class', 2023, 'Luxury', 95.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1555618254-74c8f8c57ab0?w=500', ARRAY['Leather Seats', 'Premium Audio', 'Navigation', 'Massage Seats'], 'Main Branch'),
('Jeep', 'Wrangler', 2023, 'SUV', 65.00, 'Manual', 'Petrol', 4, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500', ARRAY['4WD', 'Removable Top', 'Off-road Package'], 'Main Branch'),
('Hyundai', 'Elantra', 2023, 'Compact', 36.00, 'Automatic', 'Petrol', 5, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500', ARRAY['Air Conditioning', 'Bluetooth', 'Apple CarPlay'], 'Main Branch');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.vehicles TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE vehicles_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE bookings_id_seq TO authenticated;

-- Success message
SELECT 'Database schema created successfully! Tables: vehicles, bookings with sample data.' as result;
