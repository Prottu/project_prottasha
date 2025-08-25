import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { apiService } from '../services/apiService'
import { useAuth } from '../contexts/AuthContext'
import 'react-datepicker/dist/react-datepicker.css'

const VehicleDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, getAuthToken } = useAuth()
  
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingData, setBookingData] = useState({
    startDate: null,
    endDate: null
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchVehicle()
  }, [id])

  useEffect(() => {
    calculateTotalPrice()
  }, [bookingData.startDate, bookingData.endDate, vehicle])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getVehicle(id)
      setVehicle(response.vehicle)
    } catch (error) {
      setError('Failed to load vehicle details. Please try again.')
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (bookingData.startDate && bookingData.endDate && vehicle) {
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      
      if (days > 0) {
        setTotalPrice(days * vehicle.price_per_day)
      } else {
        setTotalPrice(0)
      }
    } else {
      setTotalPrice(0)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select both pickup and return dates.')
      return
    }

    try {
      setBookingLoading(true)
      const bookingPayload = {
        vehicle_id: vehicle.id,
        start_date: bookingData.startDate.toISOString().split('T')[0],
        end_date: bookingData.endDate.toISOString().split('T')[0]
      }

      const response = await apiService.createBooking(bookingPayload, getAuthToken())
      
      alert('Booking successful!')
      navigate('/my-bookings')
    } catch (error) {
      alert(error.message || 'Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const getDays = () => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Vehicle not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Vehicle Details */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {vehicle.image_url && (
                    <img 
                      src={vehicle.image_url} 
                      className="img-fluid rounded"
                      alt={`${vehicle.make} ${vehicle.model}`}
                      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                </div>
                <div className="col-md-6">
                  <h1 className="h2">{vehicle.make} {vehicle.model}</h1>
                  <p className="text-muted h5">{vehicle.year}</p>
                  
                  <div className="row g-3 mt-3">
                    <div className="col-6">
                      <strong>Type:</strong>
                      <div>{vehicle.type}</div>
                    </div>
                    <div className="col-6">
                      <strong>Transmission:</strong>
                      <div>{vehicle.transmission}</div>
                    </div>
                    <div className="col-6">
                      <strong>Fuel Type:</strong>
                      <div>{vehicle.fuel_type}</div>
                    </div>
                    <div className="col-6">
                      <strong>Seats:</strong>
                      <div>{vehicle.seats} passengers</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-primary">
                      ${vehicle.price_per_day}
                      <small className="text-muted">/day</small>
                    </h3>
                    <span className="badge bg-success">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Features */}
          <div className="card mt-4">
            <div className="card-header">
              <h5>Vehicle Features</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li>✓ Air Conditioning</li>
                    <li>✓ Power Steering</li>
                    <li>✓ Radio/CD Player</li>
                    <li>✓ Safety Airbags</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li>✓ GPS Navigation</li>
                    <li>✓ Bluetooth Connectivity</li>
                    <li>✓ USB Charging Ports</li>
                    <li>✓ 24/7 Roadside Assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header">
              <h5>Book This Vehicle</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Pickup Date</label>
                <DatePicker
                  selected={bookingData.startDate}
                  onChange={(date) => setBookingData({ ...bookingData, startDate: date })}
                  minDate={new Date()}
                  className="form-control"
                  placeholderText="Select pickup date"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Return Date</label>
                <DatePicker
                  selected={bookingData.endDate}
                  onChange={(date) => setBookingData({ ...bookingData, endDate: date })}
                  minDate={bookingData.startDate || new Date()}
                  className="form-control"
                  placeholderText="Select return date"
                />
              </div>

              {getDays() > 0 && (
                <div className="mb-3">
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between">
                      <span>Daily Rate:</span>
                      <span>${vehicle.price_per_day}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Duration:</span>
                      <span>{getDays()} day{getDays() !== 1 ? 's' : ''}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-primary w-100"
                onClick={handleBooking}
                disabled={bookingLoading || !bookingData.startDate || !bookingData.endDate}
              >
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </button>

              {!user && (
                <p className="text-center mt-3 small text-muted">
                  <a href="/login">Login</a> required to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetails
