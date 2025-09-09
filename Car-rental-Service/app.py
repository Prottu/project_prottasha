import os
import logging
from datetime import date

import stripe
from flask import Flask, request, jsonify
from flask_cors import CORS
from dateutil.parser import parse as parse_date

from config import Config
from auth import authenticate_user, authenticate_admin

# -------------------- App & Config -------------------- #
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["SECRET_KEY"] = Config.SECRET_KEY

# Logging (helps you see why things fail)
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("car-rental")

# Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Supabase
supabase = Config.get_supabase_client()
admin_supabase = Config.get_supabase_admin_client()

@app.route("/")
def home():
    return jsonify({"message": "Car Rental API is running!", "status": "success"})

# -------------------- Vehicles -------------------- #
@app.route("/api/vehicles", methods=["GET"])
def get_vehicles():
    try:
        vehicle_type = request.args.get("type")
        transmission = request.args.get("transmission")
        min_price = request.args.get("min_price")
        max_price = request.args.get("max_price")

        query = supabase.table("vehicles").select("*").eq("available", True)
        if vehicle_type:
            query = query.eq("category", vehicle_type)
        if transmission:
            query = query.eq("transmission", transmission)
        if min_price:
            query = query.gte("price_per_day", float(min_price))
        if max_price:
            query = query.lte("price_per_day", float(max_price))

        result = query.execute()
        return jsonify({"vehicles": result.data, "status": "success"})
    except Exception as e:
        log.exception("get_vehicles failed")
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/vehicles/<vehicle_id>", methods=["GET"])
def get_vehicle(vehicle_id):
    try:
        result = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if not result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404
        return jsonify({"vehicle": result.data[0], "status": "success"})
    except Exception as e:
        log.exception("get_vehicle failed")
        return jsonify({"error": str(e), "status": "error"}), 500

# -------------------- Bookings -------------------- #
@app.route("/api/bookings", methods=["POST"])
@authenticate_user
def create_booking():
    """Create a new booking with status=pending"""
    try:
        data = request.get_json(force=True)
        user_id = request.current_user.id
        vehicle_id = data.get("vehicle_id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not all([vehicle_id, start_date, end_date]):
            return jsonify({"error": "Missing required fields", "status": "error"}), 400

        start_date_obj = parse_date(start_date).date()
        end_date_obj = parse_date(end_date).date()

        if start_date_obj >= end_date_obj:
            return jsonify({"error": "End date must be after start date", "status": "error"}), 400
        if start_date_obj < date.today():
            return jsonify({"error": "Start date cannot be in the past", "status": "error"}), 400

        vehicle_result = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if not vehicle_result.data:
            return jsonify({"error": "Vehicle not found", "status": "error"}), 404

        vehicle = vehicle_result.data[0]
        if not vehicle.get("available", False):
            return jsonify({"error": "Vehicle is not available", "status": "error"}), 400

        days = (end_date_obj - start_date_obj).days
        total_price = float(vehicle["price_per_day"]) * days

        booking_data = {
            "user_id": user_id,
            "vehicle_id": vehicle_id,
            "start_date": start_date,
            "end_date": end_date,
            "total_amount": total_price,
            "status": "pending",
            "customer_name": request.current_user.user_metadata.get("full_name", "Customer"),
            "customer_email": request.current_user.email,
        }

        result = admin_supabase.table("bookings").insert(booking_data).execute()
        return jsonify({"booking": result.data[0], "status": "success"}), 201
    except Exception as e:
        log.exception("create_booking failed")
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/my-bookings", methods=["GET"])
@authenticate_user
def get_my_bookings():
    """
    Return the current user's bookings as a PLAIN ARRAY.
    (Your frontend expects Array.isArray(response) === true)
    """
    try:
        user_id = request.current_user.id
        q = admin_supabase.table("bookings").select("*").eq("user_id", user_id)
        # Order by created_at DESC if exists; otherwise remove next line
        try:
            q = q.order("created_at", desc=True)
        except Exception:
            pass
        res = q.execute()
        return jsonify(res.data), 200
    except Exception as e:
        log.exception("get_my_bookings failed")
        return jsonify({"error": str(e)}), 500

# -------------------- Payments -------------------- #
def _parse_amount_to_cents(amount_value):
    """Accept int/float/str and convert to integer cents; raise on invalid."""
    if isinstance(amount_value, (int, float)):
        amount = float(amount_value)
    elif isinstance(amount_value, str):
        amount = float(amount_value.strip())
    else:
        raise ValueError("Invalid amount")
    if amount <= 0:
        raise ValueError("Invalid amount")
    return int(round(amount * 100))

@app.route("/api/payment_intent", methods=["POST"])
@authenticate_user
def create_payment_intent():
    """Create a Stripe PaymentIntent for a booking."""
    try:
        data = request.get_json(force=True)
        user_id = request.current_user.id
        booking_id = data.get("booking_id")
        amount_in = data.get("amount")

        if not booking_id or amount_in is None:
            return jsonify({"error": "Missing required fields (booking_id, amount)"}), 400

        try:
            amount_cents = _parse_amount_to_cents(amount_in)
        except Exception as e:
            return jsonify({"error": f"Invalid amount: {e}"}), 400

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="usd",
            metadata={"booking_id": str(booking_id), "user_id": str(user_id)},
        )
        log.info("Created PaymentIntent %s for booking %s", intent.id, booking_id)
        return jsonify({"client_secret": intent.client_secret}), 200

    except stripe.error.StripeError as e:
        log.exception("Stripe error (create_payment_intent)")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        log.exception("create_payment_intent failed")
        return jsonify({"error": str(e)}), 500

@app.route("/api/bookings/<booking_id>/confirm_payment", methods=["POST"])
@authenticate_user
def confirm_payment(booking_id):
    """
    Confirm payment and set booking.status='confirmed'.
    For demo, if payment_intent_id is 'demo_intent_id', confirm without Stripe.
    """
    try:
        data = request.get_json(force=True)
        payment_intent_id = data.get("payment_intent_id")
        if not payment_intent_id:
            return jsonify({"error": "Payment intent ID is missing"}), 400

        # DEMO: If payment_intent_id is 'demo_intent_id', skip Stripe check
        if payment_intent_id == "demo_intent_id":
            result = admin_supabase.table("bookings").update({"status": "confirmed"}) \
                                   .eq("id", booking_id).execute()
            ok = getattr(result, "status_code", 200)
            log.info("Demo: Updated booking %s to confirmed, status_code=%s", booking_id, ok)
            if ok == 200:
                return jsonify({"status": "Booking confirmed"}), 200
            return jsonify({"error": "Failed to update booking status"}), 500

        # Real Stripe check
        pi = stripe.PaymentIntent.retrieve(payment_intent_id)
        log.info("Retrieved PaymentIntent %s (status=%s)", pi.id, pi.status)

        if pi.status == "succeeded":
            result = admin_supabase.table("bookings").update({"status": "confirmed"}) \
                                   .eq("id", booking_id).execute()
            ok = getattr(result, "status_code", 200)
            log.info("Updated booking %s to confirmed, status_code=%s", booking_id, ok)
            if ok == 200:
                return jsonify({"status": "Booking confirmed"}), 200
            return jsonify({"error": "Failed to update booking status"}), 500

        return jsonify({"error": "Payment not completed"}), 400

    except stripe.error.StripeError as e:
        log.exception("Stripe error (confirm_payment)")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        log.exception("confirm_payment failed")
        return jsonify({"error": str(e)}), 500
    
# ------------------- User: Cancel My Booking ------------------- #
@app.route("/api/bookings/<int:booking_id>/cancel", methods=["PATCH", "OPTIONS"])
@authenticate_user
def cancel_my_booking(booking_id):
    """
    Allows the authenticated user to cancel their own booking.
    Rules:
      - Booking must exist and belong to the current user.
      - Status must be 'pending' or 'confirmed'.
      - Start date must be in the future (cannot cancel on/after start date).
    Returns a simple payload: {"status": "cancelled", "booking_id": <id>}
    """
    try:
        # 1) Fetch booking
        res = admin_supabase.table("bookings").select("*").eq("id", booking_id).execute()
        if not res.data:
            return jsonify({"error": "Booking not found"}), 404

        booking = res.data[0]

        # 2) Ownership check
        current_user_id = request.current_user.id
        if str(booking["user_id"]) != str(current_user_id):
            return jsonify({"error": "Forbidden: not your booking"}), 403

        # 3) State & date checks
        status = (booking.get("status") or "").lower()
        if status in ("cancelled", "completed", "active"):
            return jsonify({"error": f"Cannot cancel a {status} booking"}), 400

        start_date_str = booking.get("start_date")
        if not start_date_str:
            return jsonify({"error": "Booking start_date missing"}), 400

        start_date_obj = (
            start_date_str if isinstance(start_date_str, date)
            else datetime.fromisoformat(str(start_date_str)).date()
        )

        # Disallow cancel if it’s today or already started
        if start_date_obj <= date.today():
            return jsonify({"error": "Cannot cancel on or after the start date"}), 400

        if status not in ("pending", "confirmed"):
            return jsonify({"error": "Only pending or confirmed bookings can be cancelled"}), 400

        # 4) Update booking -> cancelled
        update_payload = {
            "status": "cancelled",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        upd = admin_supabase.table("bookings").update(update_payload).eq("id", booking_id).execute()

        # (Optional) If you mark vehicles unavailable for pending bookings,
        # you could free it here by setting vehicles.available = true.
        # admin_supabase.table("vehicles").update({"available": True}).eq("id", booking["vehicle_id"]).execute()

        return jsonify({"status": "cancelled", "booking_id": booking_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# -------------------- Main -------------------- #
if __name__ == "__main__":
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Content-Type", "Authorization"],
    )
    # Ensure Stripe key exists; helpful message if not
    if not stripe.api_key:
        log.warning("STRIPE_SECRET_KEY is not set. Payments will fail.")
    app.run(debug=True, host="0.0.0.0", port=5000)