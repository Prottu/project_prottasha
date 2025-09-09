import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { supabase } from "../supabaseClient";

const DEMO_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/34",
  cvc: "123",
  name: "Demo User"
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, bookingId } = location.state || {};
  const [card, setCard] = useState({
    number: DEMO_CARD.number,
    expiry: DEMO_CARD.expiry,
    cvc: DEMO_CARD.cvc,
    name: DEMO_CARD.name
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((res) => setTimeout(res, 1500));
      // Get auth token
      const { data, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !data?.session?.access_token) throw new Error("You are not logged in.");
      const token = data.session.access_token;
      // Confirm payment and update booking status in backend (send demo_intent_id)
      await apiService.confirmPayment(bookingId, "demo_intent_id", token);
      setSuccess(true);
      setTimeout(() => navigate("/my-bookings"), 2000);
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="text-center mb-4">Payment</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3">
            <div className="text-muted small">Total Amount</div>
            <div className="fs-4 fw-bold text-success">
              {typeof totalAmount === "number"
                ? totalAmount.toLocaleString(undefined, { style: "currency", currency: "USD" })
                : "$0.00"}
            </div>
          </div>
          <form onSubmit={handlePay}>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control"
                name="number"
                value={card.number}
                onChange={handleChange}
                maxLength={19}
                required
                placeholder="Card Number"
                autoComplete="cc-number"
              />
              <div className="form-text">Demo: 4242 4242 4242 4242</div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Expiry</label>
                <input
                  type="text"
                  className="form-control"
                  name="expiry"
                  value={card.expiry}
                  onChange={handleChange}
                  maxLength={5}
                  required
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </div>
              <div className="col">
                <label className="form-label">CVC</label>
                <input
                  type="text"
                  className="form-control"
                  name="cvc"
                  value={card.cvc}
                  onChange={handleChange}
                  maxLength={4}
                  required
                  placeholder="CVC"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={card.name}
                onChange={handleChange}
                required
                placeholder="Cardholder Name"
                autoComplete="cc-name"
              />
            </div>
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}
            {success ? (
              <div className="alert alert-success py-2 text-center fw-bold">
                Payment Successful!
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay ${typeof totalAmount === "number"
                  ? totalAmount.toLocaleString(undefined, { style: "currency", currency: "USD" })
                  : "$0.00"}`}
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="text-center text-muted small">
        <div>Demo Payment Only. Use card <b>{DEMO_CARD.number}</b></div>
      </div>
    </div>
  );
}