// client/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with a base URL to your backend API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor to automatically include JWT in headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
