import React, { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import { useAuth } from '../contexts/AuthContext'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getAuthToken } = useAuth()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getMyBookings(getAuthToken())
      setBookings(response || []) // response is directly the array
    } catch (error) {
      setError('Failed to load bookings. Please try again.')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await apiService.cancelBooking(bookingId, getAuthToken())
      alert('Booking cancelled successfully!')
      fetchBookings() // Refresh the list
    } catch (error) {
      alert(error.message || 'Failed to cancel booking. Please try again.')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-success'
      case 'Completed':
        return 'bg-primary'
      case 'Cancelled':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  const canCancelBooking = (booking) => {
    const startDate = new Date(booking.start_date)
    const today = new Date()
    return booking.booking_status === 'Confirmed' && startDate > today
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">My Bookings</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {bookings.length > 0 ? (
            <div className="row">
              {bookings.map((booking) => (
                <div key={booking.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    {booking.vehicles?.image_url && (
                      <img 
                        src={booking.vehicles.image_url} 
                        className="card-img-top"
                        alt={`${booking.vehicles.make} ${booking.vehicles.model}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">
                          {booking.vehicles?.make} {booking.vehicles?.model}
                        </h5>
                        <span className={`badge ${getStatusBadgeClass(booking.booking_status)}`}>
                          {booking.booking_status}
                        </span>
                      </div>

                      <p className="card-text text-muted small">
                        {booking.vehicles?.type}
                      </p>

                      <div className="booking-details mb-3">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted">Pickup:</small>
                            <div className="fw-bold">{formatDate(booking.start_date)}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Return:</small>
                            <div className="fw-bold">{formatDate(booking.end_date)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Total Amount:</span>
                          <span className="fw-bold text-primary">${booking.total_price}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <small className="text-muted">
                          Booked on: {formatDate(booking.created_at)}
                        </small>
                        
                        {canCancelBooking(booking) && (
                          <button 
                            className="btn btn-outline-danger btn-sm mt-2 w-100"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-calendar-times fa-3x text-muted"></i>
              </div>
              <h4>No bookings found</h4>
              <p className="text-muted">
                You haven't made any bookings yet. Start by browsing our available vehicles.
              </p>
              <a href="/vehicles" className="btn btn-primary">
                Browse Vehicles
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBookings
