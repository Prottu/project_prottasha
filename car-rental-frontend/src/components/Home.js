import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/apiService'
import carImage from '../assets/car.jpg'
import './css/Home.css'

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchDates, setSearchDates] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await apiService.getVehicles()
      // Get first 3 vehicles as featured
      setFeaturedVehicles(response.vehicles.slice(0, 3))
    } catch (error) {
      console.error('Error fetching featured vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Navigate to vehicles page with search dates
    const params = new URLSearchParams()
    if (searchDates.startDate) params.append('start_date', searchDates.startDate)
    if (searchDates.endDate) params.append('end_date', searchDates.endDate)
    
    window.location.href = `/vehicles?${params.toString()}`
  }

  const handleDateChange = (e) => {
    setSearchDates({
      ...searchDates,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Find Your Perfect Rental Car
              </h1>
              <p className="lead mb-4">
                Discover the best cars for your journey. From economy to luxury, 
                we have the perfect vehicle for every occasion.
              </p>
              <Link to="/vehicles" className="btn btn-light btn-lg">
                Browse All Cars
              </Link>
            </div>
            <div className="col-lg-6">
              <img 
                src={carImage} 
                alt="Car rental" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body p-4">
                  <h3 className="text-center mb-4">Quick Search</h3>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="row g-3">
                      <div className="col-md-5">
                        <label htmlFor="startDate" className="form-label">
                          Pick-up Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          name="startDate"
                          value={searchDates.startDate}
                          onChange={handleDateChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-5">
                        <label htmlFor="endDate" className="form-label">
                          Return Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          name="endDate"
                          value={searchDates.endDate}
                          onChange={handleDateChange}
                          min={searchDates.startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="featured-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Vehicles</h2>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {featuredVehicles.length > 0 ? (
                featuredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      {vehicle.image_url && (
                        <img 
                          src={vehicle.image_url} 
                          className="card-img-top"
                          alt={`${vehicle.make} ${vehicle.model}`}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = carImage
                          }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">
                          {vehicle.make} {vehicle.model}
                        </h5>
                        <p className="card-text text-muted">
                          {vehicle.year} • {vehicle.type} • {vehicle.transmission}
                        </p>
                        <p className="card-text">
                          <strong>${vehicle.price_per_day}/day</strong>
                        </p>
                        <Link 
                          to={`/vehicles/${vehicle.id}`} 
                          className="btn btn-outline-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-muted">No vehicles available at the moment.</p>
                  <p className="text-muted">Please check back later or contact us for assistance.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/vehicles" className="btn btn-primary btn-lg">
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="feature-icon bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  🚗
                </div>
                <h4>Wide Selection</h4>
                <p className="text-muted">
                  Choose from a diverse fleet of vehicles to match your needs and budget.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="feature-icon bg-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  💰
                </div>
                <h4>Best Prices</h4>
                <p className="text-muted">
                  Competitive rates with no hidden fees. Get the best value for your money.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="feature-icon bg-info text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  🛡️
                </div>
                <h4>Easy Booking</h4>
                <p className="text-muted">
                  Quick and secure online booking process with instant confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
