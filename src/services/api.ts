import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://carefit-api.onrender.com/api'
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Contact form submission
export const submitContactForm = async (data: {
  name: string;
  email: string;
  phone: string;
  objective: string;
  message: string;
}) => {
  const response = await api.post('/contact', data);
  return response.data;
};


export default api;