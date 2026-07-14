// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5248/api',
});

// Đây là "người vận chuyển" tự động gắn Token
api.interceptors.request.use((config) => {
  const sessionData = localStorage.getItem("jobportal_session");
  if (sessionData) {
    const session = JSON.parse(sessionData);
    if (session && session.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }
  return config;
});

export default api;