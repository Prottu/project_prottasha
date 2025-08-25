import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCar = location.state?.car;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    dropoffDate: '',
    location: '',
    color: '',
  });

  if (!selectedCar) return <p>No car selected.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, car: selectedCar.name });

    // Navigate to the booking success page
    navigate('/booking-success', {
      state: { name: formData.name, car: selectedCar.name, color: formData.color },
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-8 col-lg-6">
        <h3 className="text-center mb-3">Book: {selectedCar.name}</h3>
        <p className="text-center text-muted mb-4">Please fill in the form to confirm your booking.</p>
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                className="form-control"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Drop-off Date</label>
              <input
                type="date"
                name="dropoffDate"
                className="form-control"
                value={formData.dropoffDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Pickup Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Select Car Color</label>
            <select
              name="color"
              className="form-select"
              value={formData.color}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose a color --</option>
              {selectedCar.colors.map((color, index) => (
                <option key={index} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Confirm Booking
          </button>

          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => navigate('/cars')}
          >
            Back to Car List
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;

