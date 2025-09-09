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

      // ✅ get a real token string
      const token = await getAuthToken()

      // ✅ pass the actual token
      const response = await apiService.getAllBookings(token)

      // ✅ handle both shapes: array or { bookings: [...] }
      const list = Array.isArray(response) ? response : (response?.bookings || [])
      setBookings(list)
    } catch (error) {
      setError('Failed to load bookings.')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSubmit = async (e) => {
    e.preventDefault()

    console.log(vehicleForm);  // Add this to inspect the form data

    try {
      const token = await getAuthToken();

      if (editingVehicle) {
        // Update vehicle
        await apiService.updateVehicle(editingVehicle.id, vehicleForm, token)
        alert('Vehicle updated successfully!')
      } else {
        // Add new vehicle
        await apiService.addVehicle(vehicleForm, token)
        alert('Vehicle added successfully!')
      }

      resetVehicleForm()
      fetchVehicles()  // Reload the vehicle list after submission
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
      const token = await getAuthToken();
      await apiService.deleteVehicle(vehicleId, token)
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
                  {/* Form fields (same as before) */}
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
                <div className="
