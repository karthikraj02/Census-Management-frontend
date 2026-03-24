import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://census-management-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const submitVote = (payload) => api.post('/vote', payload);
export const fetchData = () => api.get('/data');
export const fetchCounts = (isVaccinated) => api.get(`/counts?is_vaccinated=${isVaccinated}`);
export const fetchResults = () => api.get('/results');
