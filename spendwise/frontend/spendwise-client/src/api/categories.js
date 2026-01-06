import api from './axios.js';

export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createCategory = async (payload) => {
  const res = await api.post('/categories', payload);
  return res.data?.data;
};