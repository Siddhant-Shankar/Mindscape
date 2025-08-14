// client/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with a base URL to your backend API
const api = axios.create({
  // baseURL: 'http://localhost:8000/api', //That works locally, but once you deploy, your backend URL will not be localhost. It might be something like:
  //https://mindscape-backend.onrender.com/api - therefore we cannot hardcode local host which means we need to change it
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Request interceptor to automatically include JWT in headers - stays the same even after the axios instance changes
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
