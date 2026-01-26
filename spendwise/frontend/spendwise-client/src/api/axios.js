import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url === '/auth/me' && error.response?.status === 401) {
      return Promise.reject(error);
    }
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;