import axios from 'axios';

const api = axios.create({
  baseURL: 'https://product.backend.machinevision.global',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;