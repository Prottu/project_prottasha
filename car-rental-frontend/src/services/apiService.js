import { API_BASE_URL } from '../supabaseClient'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Vehicle endpoints
  async getVehicles(filters = {}) {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()
    const endpoint = `/api/vehicles${queryString ? `?${queryString}` : ''}`
    
    return this.makeRequest(endpoint)
  }

  async getVehicle(vehicleId) {
    return this.makeRequest(`/api/vehicles/${vehicleId}`)
  }

  // Booking endpoints
  async createBooking(bookingData, authToken) {
    return this.makeRequest('/api/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingData),
    })
  }

  async getMyBookings(authToken) {
    return this.makeRequest('/api/my-bookings', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
  }

  async cancelBooking(bookingId, authToken) {
    return this.makeRequest(`/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
  }

  // Admin endpoints
  async addVehicle(vehicleData, authToken) {
    return this.makeRequest('/api/admin/vehicles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(vehicleData),
    })
  }

  async updateVehicle(vehicleId, vehicleData, authToken) {
    return this.makeRequest(`/api/admin/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(vehicleData),
    })
  }

  async deleteVehicle(vehicleId, authToken) {
    return this.makeRequest(`/api/admin/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
  }

  async getAllBookings(authToken) {
    return this.makeRequest('/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
  }
}

export const apiService = new ApiService()
