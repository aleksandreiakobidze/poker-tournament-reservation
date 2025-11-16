// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Reservation API
export const reservationAPI = {
  create: (data) => apiCall('/reserve', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: () => apiCall('/admin/reservations'),

  checkin: (phone) => apiCall(`/admin/reservations/${phone}/checkin`, {
    method: 'PUT',
  }),

  markMissing: (phone) => apiCall(`/admin/reservations/${phone}/missing`, {
    method: 'PUT',
  }),

  delete: (phone) => apiCall(`/admin/reservations/${phone}`, {
    method: 'DELETE',
  }),

  deleteAll: () => apiCall('/admin/reservations/all', {
    method: 'DELETE',
  }),

  promote: (phone) => apiCall(`/admin/reservations/${phone}/promote`, {
    method: 'PUT',
  }),
};

// Settings API
export const settingsAPI = {
  get: () => apiCall('/admin/settings'),

  update: (data) => apiCall('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Tournament Info API
export const tournamentAPI = {
  get: () => apiCall('/admin/tournament-info'),

  update: (data) => apiCall('/admin/tournament-info', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export { API_BASE_URL };

