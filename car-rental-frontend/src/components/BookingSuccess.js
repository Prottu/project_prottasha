import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, car, color } = location.state || {};

  if (!name || !car || !color) {
    return (
      <div className="container text-center mt-5">
        <h4>No booking details found.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/cars')}>
          Back to Car List
        </button>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-5" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="text-success display-4">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="mt-3">Booking Confirmed!</h2>
          <p className="text-muted">Thank you for booking with us.</p>
        </div>

        <hr />

        <div className="mb-3">
          <strong>Customer Name:</strong> <span className="ms-2">{name}</span>
        </div>

        <div className="mb-3">
          <strong>Car Booked:</strong> <span className="ms-2">{car}</span>
        </div>

        <div className="mb-3">
          <strong>Selected Color:</strong> <span className="ms-2">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
        </div>

        <div className="alert alert-success mt-4" role="alert">
          Your booking has been successfully submitted. A confirmation email will be sent shortly.
        </div>

        <div className="text-center">
          <button className="btn btn-primary mt-3" onClick={() => navigate('/cars')}>
            Book Another Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
