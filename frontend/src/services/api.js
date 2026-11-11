const API_BASE = '/api';

export const api = {
  // Spots
  async getSpots(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const url = `${API_BASE}/spots${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch parking spots');
    return res.json();
  },

  async getSpotById(id) {
    const res = await fetch(`${API_BASE}/spots/${id}`);
    if (!res.ok) throw new Error('Failed to fetch spot details');
    return res.json();
  },

  async createSpot(spotData) {
    const res = await fetch(`${API_BASE}/spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to list parking spot');
    return data;
  },

  async getLocalities() {
    const res = await fetch(`${API_BASE}/spots/localities`);
    if (!res.ok) throw new Error('Failed to fetch localities');
    return res.json();
  },

  async searchDestinations(q) {
    const res = await fetch(`${API_BASE}/spots/destinations?q=${encodeURIComponent(q || '')}`);
    if (!res.ok) throw new Error('Failed to search destinations');
    return res.json();
  },

  async getSpotsNear(lat, lng, radiusKm = 5, maxPrice) {
    const query = new URLSearchParams({ lat, lng, radiusKm });
    if (maxPrice) query.append('maxPrice', maxPrice);
    const res = await fetch(`${API_BASE}/spots/near?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch nearby spots');
    return res.json();
  },

  async deleteSpot(id) {
    const res = await fetch(`${API_BASE}/spots/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete spot');
    return res.json();
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create booking');
    return data;
  },

  async getBookings(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/bookings${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },

  // Verification & Guard actions
  async verifyCode(code) {
    const res = await fetch(`${API_BASE}/bookings/verify/${encodeURIComponent(code)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Booking not found or invalid');
    }
    return data;
  },

  async checkInBooking(id, payload = {}) {
    const res = await fetch(`${API_BASE}/bookings/${id}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Check-in failed');
    return data;
  },

  async checkOutBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Check-out failed');
    return data;
  },

  async resetSeed() {
    const res = await fetch(`${API_BASE}/seed/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset sample data');
    return res.json();
  },
};

