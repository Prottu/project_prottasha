from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date
from dateutil.parser import parse as parse_date
from config import Config
from auth import authenticate_user, authenticate_admin
import json

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = Config.SECRET_KEY

# Initialize Supabase client
supabase = Config.get_supabase_client()
admin_supabase = Config.get_supabase_admin_client()

@app.route("/")
def home():
    return jsonify({"message": "Car Rental API is running!", "status": "success"})

# Vehicle endpoints
@app.route("/api/vehicles", methods=["GET"])
def get_vehicles():
    """Get all available vehicles with optional filtering"""
    try:
        # Get query parameters for filtering
        vehicle_type = request.args.get('type')
        transmission = request.args.get('transmission')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        
        # Build query
        query = supabase.table('vehicles').select('*').eq('available', True)
        
        # Apply filters
        if vehicle_type:
            query = query.eq('category', vehicle_type)
        if transmission:
            query = query.eq('transmission', transmission)
        if min_price:
            query = query.gte('price_per_day', float(min_price))
        if max_price:
            query = query.lte('price_per_day', float(max_price))
        
        result = query.execute()
        return jsonify({"vehicles": result.data, "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/vehicles/<vehicle_id>", methods=["GET"])
def get_vehicle(vehicle_id):
    """Get a specific vehicle by ID"""
    try:
        result = supabase.table('vehicles').select('*').eq('id', vehicle_id).execute()
        
        if not result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404
        
        return jsonify({"vehicle": result.data[0], "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Booking endpoints
@app.route("/api/bookings", methods=["POST"])
@authenticate_user
def create_booking():
    """Create a new booking"""
    try:
        print(f"Request content type: {request.content_type}")
        print(f"Request data: {request.data}")
        print(f"Request form: {request.form}")
        print(f"Request args: {request.args}")
        
        data = request.get_json(force=True)
        print(f"Parsed JSON data: {data}")
        
        user_id = request.current_user.id
        vehicle_id = data.get('vehicle_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if not all([vehicle_id, start_date, end_date]):
            return jsonify({"error": "Missing required fields", "status": "error"}), 400
        
        # Parse dates
        start_date_obj = parse_date(start_date).date()
        end_date_obj = parse_date(end_date).date()
        
        if start_date_obj >= end_date_obj:
            return jsonify({"error": "End date must be after start date", "status": "error"}), 400
        
        if start_date_obj < date.today():
            return jsonify({"error": "Start date cannot be in the past", "status": "error"}), 400
        
        # Get vehicle to calculate price
        vehicle_result = supabase.table('vehicles').select('*').eq('id', vehicle_id).execute()
        if not vehicle_result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404
        
        vehicle = vehicle_result.data[0]
        if not vehicle['available']:
            return jsonify({"error": "Vehicle is not available", "status": "error"}), 400
        
        # Check for conflicting bookings
        existing_bookings = admin_supabase.table('bookings').select('*').eq('vehicle_id', vehicle_id).neq('status', 'cancelled').execute()
        
        for booking in existing_bookings.data:
            existing_start = parse_date(booking['start_date']).date()
            existing_end = parse_date(booking['end_date']).date()
            
            # Check for date overlap
            if not (end_date_obj <= existing_start or start_date_obj >= existing_end):
                return jsonify({"error": "Vehicle is already booked for the selected dates", "status": "error"}), 400
        
        # Calculate total price
        days = (end_date_obj - start_date_obj).days
        total_price = float(vehicle['price_per_day']) * days
        
        # Create booking
        booking_data = {
            'user_id': user_id,
            'vehicle_id': vehicle_id,
            'start_date': start_date,
            'end_date': end_date,
            'total_amount': total_price,
            'status': 'confirmed',
            'customer_name': request.current_user.user_metadata.get('full_name', 'Customer'),
            'customer_email': request.current_user.email
        }
        
        result = admin_supabase.table('bookings').insert(booking_data).execute()
        return jsonify({"booking": result.data[0], "status": "success"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/api/my-bookings', methods=['GET'])
@authenticate_user
def get_user_bookings():
    try:
        user_id = request.current_user.id
        print(f"Fetching bookings for user_id: {user_id}")
        
        # Use admin client to bypass RLS for this query
        result = admin_supabase.table('bookings').select('*').eq('user_id', user_id).execute()
        
        print(f"Query result: {result}")
        
        if result.data:
            return jsonify(result.data)
        else:
            return jsonify([])
            
    except Exception as e:
        print(f"Error fetching user bookings: {e}")
        return jsonify({'error': 'Failed to fetch bookings'}), 500

@app.route("/api/bookings/<booking_id>/cancel", methods=["PATCH"])
@authenticate_user
def cancel_booking(booking_id):
    """Cancel a specific booking"""
    try:
        user_id = request.current_user.id
        
        # Check if booking exists and belongs to user
        booking_result = admin_supabase.table('bookings').select('*').eq('id', booking_id).eq('user_id', user_id).execute()
        
        if not booking_result.data:
            return jsonify({"error": "Booking not found", "status": "error"}), 404
        
        booking = booking_result.data[0]
        
        if booking['status'] == 'cancelled':
            return jsonify({"error": "Booking is already cancelled", "status": "error"}), 400
        
        # Check if booking can be cancelled (not in the past)
        start_date = parse_date(booking['start_date']).date()
        if start_date <= date.today():
            return jsonify({"error": "Cannot cancel past or ongoing bookings", "status": "error"}), 400
        
        # Update booking status
        result = admin_supabase.table('bookings').update({'status': 'cancelled'}).eq('id', booking_id).execute()
        
        return jsonify({"booking": result.data[0], "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Admin endpoints
@app.route("/api/admin/vehicles", methods=["POST"])
@authenticate_admin
def add_vehicle():
    """Add a new vehicle (admin only)"""
    try:
        data = request.json
        
        required_fields = ['make', 'model', 'year', 'category', 'transmission', 'fuel_type', 'seats', 'price_per_day']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}", "status": "error"}), 400
        
        vehicle_data = {
            'make': data['make'],
            'model': data['model'],
            'year': int(data['year']),
            'category': data['category'],
            'transmission': data['transmission'],
            'fuel_type': data['fuel_type'],
            'seats': int(data['seats']),
            'price_per_day': float(data['price_per_day']),
            'image_url': data.get('image_url', ''),
            'available': data.get('available', True)
        }
        
        result = admin_supabase.table('vehicles').insert(vehicle_data).execute()
        return jsonify({"vehicle": result.data[0], "status": "success"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/admin/vehicles/<vehicle_id>", methods=["PUT"])
@authenticate_admin
def update_vehicle(vehicle_id):
    """Update an existing vehicle (admin only)"""
    try:
        data = request.json
        
        # Build update data
        update_data = {}
        allowed_fields = ['make', 'model', 'year', 'category', 'transmission', 'fuel_type', 'seats', 'price_per_day', 'image_url', 'available']
        
        for field in allowed_fields:
            if field in data:
                if field in ['year', 'seats']:
                    update_data[field] = int(data[field])
                elif field == 'price_per_day':
                    update_data[field] = float(data[field])
                else:
                    update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update", "status": "error"}), 400
        
        result = admin_supabase.table('vehicles').update(update_data).eq('id', vehicle_id).execute()
        
        if not result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404
        
        return jsonify({"vehicle": result.data[0], "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/admin/vehicles/<vehicle_id>", methods=["DELETE"])
@authenticate_admin
def delete_vehicle(vehicle_id):
    """Delete a vehicle (admin only)"""
    try:
        # Check if vehicle has active bookings
        active_bookings = admin_supabase.table('bookings').select('*').eq('vehicle_id', vehicle_id).neq('status', 'cancelled').execute()
        
        if active_bookings.data:
            return jsonify({"error": "Cannot delete vehicle with active bookings", "status": "error"}), 400
        
        result = admin_supabase.table('vehicles').delete().eq('id', vehicle_id).execute()
        
        if not result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404
        
        return jsonify({"message": "Vehicle deleted successfully", "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/admin/bookings", methods=["GET"])
@authenticate_admin
def get_all_bookings():
    """Get all bookings (admin only)"""
    try:
        result = admin_supabase.table('bookings').select('''
            *,
            vehicles (
                make,
                model,
                category
            )
        ''').order('created_at', desc=True).execute()
        
        return jsonify({"bookings": result.data, "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Development endpoint to make user admin (remove in production)
@app.route("/api/make-admin/<user_email>", methods=["POST"])
def make_admin(user_email):
    """Make a user admin - FOR DEVELOPMENT ONLY"""
    try:
        # Get user by email
        result = admin_supabase.auth.admin.list_users()
        users = result.users if hasattr(result, 'users') else []
        
        target_user = None
        for user in users:
            if user.email == user_email:
                target_user = user
                break
        
        if not target_user:
            return jsonify({"error": "User not found"}), 404
        
        # Update user metadata to include admin role
        admin_supabase.auth.admin.update_user_by_id(
            target_user.id,
            {"user_metadata": {"role": "admin"}}
        )
        
        return jsonify({"message": f"User {user_email} is now an admin", "status": "success"})
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    