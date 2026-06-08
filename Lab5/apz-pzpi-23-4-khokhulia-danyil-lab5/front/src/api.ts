/* ───────────────────────────────────────────
 *  Axios instance with JWT interceptors
 * ─────────────────────────────────────────── */
import axios from 'axios';
import { useAuthStore } from './stores/useAuthStore';

const API_BASE = 'http://localhost:5279/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: attach Bearer token ── */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Response interceptor: auto-logout on 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
