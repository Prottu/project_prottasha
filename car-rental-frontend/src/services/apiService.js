import { API_BASE_URL } from '../supabaseClient';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL; // e.g. http://localhost:5000
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    let data;
    try { data = await resp.json(); } catch { data = null; }

    if (!resp.ok) {
      const msg = (data && (data.error || data.message)) || `Request failed: ${resp.status}`;
      throw new Error(msg);
    }
    return data;
  }

  // ---- PAYMENTS ----
  async createPaymentIntent(bookingId, amount, authToken) {
    return this.makeRequest('/api/payment_intent', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ booking_id: bookingId, amount }),
    });
  }

  async confirmPayment(bookingId, paymentIntentId, authToken) {
    return this.makeRequest(`/api/bookings/${bookingId}/confirm_payment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  // Vehicle endpoints
  async getVehicles(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/vehicles${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest(endpoint);
  }

  async getVehicle(vehicleId) {
    return this.makeRequest(`/api/vehicles/${vehicleId}`);
  }

  async updateVehicle(vehicleId, vehicleData, authToken) {
    return this.makeRequest(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',  // Or 'PATCH' depending on your backend
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify(vehicleData),
    });
  }

  // ---- BOOKINGS ----
  async createBooking(bookingData, authToken) {
    return this.makeRequest('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(authToken) {
    return this.makeRequest('/api/my-bookings', {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async cancelBooking(bookingId, authToken) {
    return this.makeRequest(`/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  // ---- ADMIN ----
  // async getAllBookings(authToken) {
  //   return this.makeRequest('/api/admin/bookings', {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${authToken}` },
  //   });
  // }
}

export const apiService = new ApiService();
