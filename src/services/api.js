const API_BASE = 'http://localhost:8000';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  },

  auth: {
    login: (credentials) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    me: () => api.request('/auth/me'),
  },

  feedback: {
    list: () => api.request('/feedback/'),
    create: (data) => api.request('/feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => api.request(`/feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => api.request(`/feedback/${id}`, { method: 'DELETE' }),
    acknowledge: (id) => api.request(`/feedback/${id}/acknowledge`, { method: 'POST' }),
    stats: () => api.request('/feedback/dashboard/stats'),
  },

  users: {
    team: () => api.request('/users/team'),
  },
};

export default api;