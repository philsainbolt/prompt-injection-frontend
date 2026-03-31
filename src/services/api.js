import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.assign('/');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  profile: () => api.get('/api/users/profile'),
};

export const progressAPI = {
  get: () => api.get('/api/progress'),
  beat: (id) => api.post(`/api/progress/beat/${id}`),
};

export const challengeAPI = {
  getAll: () => api.get('/api/challenges'),
  getById: (id) => api.get(`/api/challenges/${id}`),
  submit: (id, userPrompt) =>
    api.post(`/api/challenges/${id}/submit`, {
      userPrompt,
      prompt: userPrompt,
    }),
};

export const submissionAPI = {
  getAll: () => api.get('/api/submissions'),
  getById: (id) => api.get(`/api/submissions/${id}`),
  update: (id, data) => api.put(`/api/submissions/${id}`, data),
  delete: (id) => api.delete(`/api/submissions/${id}`),
};
