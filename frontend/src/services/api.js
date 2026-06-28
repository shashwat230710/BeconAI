import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API keys/tokens if needed later
api.interceptors.request.use((config) => {
  // Example: config.headers['X-API-Key'] = localStorage.getItem('apiKey');
  return config;
});

export default api;
