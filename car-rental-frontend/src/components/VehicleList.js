import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiService } from '../services/apiService'
import './css/CarList.css'

const CarList = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    transmission: '',
    min_price: '',
    max_price: ''
  })
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchVehicles()
  }, [filters])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getVehicles(filters)
      setVehicles(response.vehicles)
    } catch (error) {
      setError('Failed to load vehicles. Please try again.')
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      transmission: '',
      min_price: '',
      max_price: ''
    })
  }

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Convertible', 'Hatchback', 'Coupe']
  const transmissionTypes = ['Automatic', 'Manual']

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Filters</h5>
            </div>
            <div className="card-body">
              {/* Vehicle Type Filter */}
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Vehicle Type</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Transmission Filter */}
              <div className="mb-3">
                <label htmlFor="transmission" className="form-label">Transmission</label>
                <select
                  className="form-select"
                  id="transmission"
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                >
                  <option value="">All Transmissions</option>
                  {transmissionTypes.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-3">
                <label className="form-label">Price Range (per day)</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min $"
                      name="min_price"
                      value={filters.min_price}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max $"
                      name="max_price"
                      value={filters.max_price}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="col-lg-9 col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Available Vehicles</h2>
            <span className="text-muted">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading vehicles...</p>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="row">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 vehicle-card">
                    {vehicle.image_url && (
                      <img 
                        src={vehicle.image_url} 
                        className="card-img-top"
                        alt={`${vehicle.make} ${vehicle.model}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        {vehicle.make} {vehicle.model}
                      </h5>
                      <p className="card-text text-muted small">
                        {vehicle.year} • {vehicle.fuel_type}
                      </p>
                      
                      <div className="vehicle-details mb-3">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted">Type:</small>
                            <div>{vehicle.type}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Transmission:</small>
                            <div>{vehicle.transmission}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Seats:</small>
                            <div>{vehicle.seats} passengers</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Fuel:</small>
                            <div>{vehicle.fuel_type}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong className="h4 text-primary">
                              ${vehicle.price_per_day}
                            </strong>
                            <small className="text-muted">/day</small>
                          </div>
                          <span className="badge bg-success">Available</span>
                        </div>
                        
                        <Link 
                          to={`/vehicles/${vehicle.id}`} 
                          className="btn btn-primary w-100"
                        >
                          View Details & Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-car fa-3x text-muted"></i>
              </div>
              <h4>No vehicles found</h4>
              <p className="text-muted">
                Try adjusting your filters or check back later for new additions.
              </p>
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default CarList