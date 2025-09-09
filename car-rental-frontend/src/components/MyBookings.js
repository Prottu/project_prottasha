import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/apiService";
import { supabase } from "../supabaseClient";

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "$0.00";

const StatusBadge = ({ status }) => {
  const color =
    status === "confirmed" ? "success" :
    status === "pending"   ? "warning" :
    status === "cancelled" ? "secondary" : "dark";
  return <span className={`badge bg-${color} text-capitalize`}>{status || "unknown"}</span>;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [actionId, setActionId] = useState(null); // disables buttons during actions

  const getToken = useCallback(async () => {
    const { data, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !data?.session?.access_token) throw new Error("You are not logged in.");
    return data.session.access_token;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const result = await apiService.getMyBookings(token);
      // Backend returns a plain array; still guard in case
      const list = Array.isArray(result)
        ? result
        : (Array.isArray(result?.bookings) ? result.bookings : []);
      // Filter out cancelled bookings
      setBookings(list.filter(b => b.status !== "cancelled"));
    } catch (e) {
      console.error("Failed to load bookings:", e);
      console.log(e); // <-- Added for detailed error logging
      setError(e.message || "Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (bookingId) => {
    try {
      setActionId(bookingId);
      const token = await getToken();
      await apiService.cancelBooking(bookingId, token);
      await load(); // refresh list
    } catch (e) {
      console.error("Cancel failed:", e);
      console.log(e); // <-- Added for detailed error logging
      setError(e.message || "Failed to cancel booking.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">My Bookings</h2>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" aria-label="Loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">My Bookings</h2>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-5">
          <h3 className="mb-2">No bookings found</h3>
          <p className="text-muted mb-4">You haven't made any bookings yet.</p>
          <Link to="/browse" className="btn btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div className="col-12 col-md-6 col-lg-4" key={b.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">Booking #{b.id}</h5>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="small text-muted mb-3">
                    <div><strong>From:</strong> {b.start_date ? new Date(b.start_date).toLocaleDateString() : "-"}</div>
                    <div><strong>To:&nbsp;&nbsp;&nbsp;</strong> {b.end_date ? new Date(b.end_date).toLocaleDateString() : "-"}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-muted small">Total Amount</div>
                    <div className="fs-5 fw-semibold">{currency(Number(b.total_amount || 0))}</div>
                  </div>

                  <div className="mb-3 small">
                    <div><strong>Vehicle ID:</strong> {b.vehicle_id || "-"}</div>
                  </div>

                  <div className="mb-3 small">
                    <div><strong>Name:</strong> {b.customer_name || "-"}</div>
                    <div><strong>Email:</strong> {b.customer_email || "-"}</div>
                  </div>

                  <div className="mt-auto d-flex gap-2">
                    {b.status === "pending" && (
                      <>
                        <Link
                          to="/payment"
                          state={{ totalAmount: b.total_amount, bookingId: b.id }}
                          className="btn btn-primary w-100"
                        >
                          Pay Now
                        </Link>

                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={() => handleCancel(b.id)}
                          disabled={actionId === b.id}
                        >
                          {actionId === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}