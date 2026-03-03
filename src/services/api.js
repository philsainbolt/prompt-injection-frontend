import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const challengeAPI = {
  getAll: () => api.get('/challenges'),
  getById: (id) => api.get(`/challenges/${id}`),
  submit: (challengeId, userInput) =>
    api.post('/challenges/submit', { challengeId, userInput }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const submissionAPI = {
  getAll: () => api.get('/submissions'),
  getById: (id) => api.get(`/submissions/${id}`),
};
