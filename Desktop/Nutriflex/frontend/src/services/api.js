import axios from 'axios';

// Base URL for the backend API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://nutriflex-im86.onrender.com/api',
  timeout: 10000,
});

// Request interceptor – attach JWT if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutriflex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor – handle 401 globally (optional clean‑up)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove invalid token and optionally redirect to login
      localStorage.removeItem('nutriflex_token');
    }
    return Promise.reject(error);
  }
);

export default api;
