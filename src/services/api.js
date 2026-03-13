import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const progressAPI = {
  get: () => api.get('/api/progress'),
  beat: (id) => api.post(`/api/progress/beat/${id}`),
};

export const challengeAPI = {
  submit: (id, userPrompt) =>
    api.post(`/api/challenges/${id}/submit`, {
      userPrompt,
      // Keep legacy key for backward compatibility with older backend builds.
      prompt: userPrompt,
    }),
};
