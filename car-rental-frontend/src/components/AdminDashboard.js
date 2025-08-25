import React, { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import { useAuth } from '../contexts/AuthContext'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('vehicles')
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { getAuthToken } = useAuth()

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    transmission: 'Automatic',
    fuel_type: 'Gasoline',
    seats: 4,
    price_per_day: '',
    image_url: '',
    is_available: true
  })
  const [editingVehicle, setEditingVehicle] = useState(null)

  useEffect(() => {
    if (activeTab === 'vehicles') {
      fetchVehicles()
    } else if (activeTab === 'bookings') {
      fetchBookings()
    }
  }, [activeTab])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getVehicles()
      setVehicles(response.vehicles)
    } catch (error) {
      setError('Failed to load vehicles.')
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getAllBookings(getAuthToken())
      setBookings(response.bookings)
    } catch (error) {
      setError('Failed to load bookings.')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingVehicle) {
        await apiService.updateVehicle(editingVehicle.id, vehicleForm, getAuthToken())
        alert('Vehicle updated successfully!')
      } else {
        await apiService.addVehicle(vehicleForm, getAuthToken())
        alert('Vehicle added successfully!')
      }
      
      resetVehicleForm()
      fetchVehicles()
    } catch (error) {
      alert(error.message || 'Failed to save vehicle.')
    }
  }

  const handleEditVehicle = (vehicle) => {
    setVehicleForm(vehicle)
    setEditingVehicle(vehicle)
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return
    }

    try {
      await apiService.deleteVehicle(vehicleId, getAuthToken())
      alert('Vehicle deleted successfully!')
      fetchVehicles()
    } catch (error) {
      alert(error.message || 'Failed to delete vehicle.')
    }
  }

  const resetVehicleForm = () => {
    setVehicleForm({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Sedan',
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      seats: 4,
      price_per_day: '',
      image_url: '',
      is_available: true
    })
    setEditingVehicle(null)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setVehicleForm({
      ...vehicleForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </li>
      </ul>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div>
          {/* Add/Edit Vehicle Form */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleVehicleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Make</label>
                      <input
                        type="text"
                        className="form-control"
                        name="make"
                        value={vehicleForm.make}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        className="form-control"
                        name="model"
                        value={vehicleForm.model}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Year</label>
                      <input
                        type="number"
                        className="form-control"
                        name="year"
                        value={vehicleForm.year}
                        onChange={handleFormChange}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={vehicleForm.type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Coupe">Coupe</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Transmission</label>
                      <select
                        className="form-select"
                        name="transmission"
                        value={vehicleForm.transmission}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Fuel Type</label>
                      <select
                        className="form-select"
                        name="fuel_type"
                        value={vehicleForm.fuel_type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Gasoline">Gasoline</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Seats</label>
                      <input
                        type="number"
                        className="form-control"
                        name="seats"
                        value={vehicleForm.seats}
                        onChange={handleFormChange}
                        min="2"
                        max="8"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Price per Day ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price_per_day"
                        value={vehicleForm.price_per_day}
                        onChange={handleFormChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="image_url"
                        value={vehicleForm.image_url}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="is_available"
                          checked={vehicleForm.is_available}
                          onChange={handleFormChange}
                        />
                        <label className="form-check-label">Available</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                  {editingVehicle && (
                    <button type="button" className="btn btn-secondary" onClick={resetVehicleForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Vehicles List */}
          <div className="card">
            <div className="card-header">
              <h5>All Vehicles</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Year</th>
                        <th>Price/Day</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td>
                            <strong>{vehicle.make} {vehicle.model}</strong>
                          </td>
                          <td>{vehicle.type}</td>
                          <td>{vehicle.year}</td>
                          <td>${vehicle.price_per_day}</td>
                          <td>
                            <span className={`badge ${vehicle.is_available ? 'bg-success' : 'bg-danger'}`}>
                              {vehicle.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="card">
          <div className="card-header">
            <h5>All Bookings</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Vehicle</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <small className="text-muted">{booking.id.slice(-8)}</small>
                        </td>
                        <td>
                          <strong>{booking.vehicles?.make} {booking.vehicles?.model}</strong>
                        </td>
                        <td>
                          <small>
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </small>
                        </td>
                        <td>${booking.total_price}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(booking.booking_status)}`}>
                            {booking.booking_status}
                          </span>
                        </td>
                        <td>
                          <small>{formatDate(booking.created_at)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
