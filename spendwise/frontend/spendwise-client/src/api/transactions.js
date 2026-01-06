import api from './axios.js';

export const fetchTransactions = async () => {
  const res = await api.get('/transactions');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createTransaction = async (payload) => {
  const res = await api.post('/transactions', payload);
  return res.data?.data;
};

export const archiveTransaction = async (id) => {
  await api.patch(`/transactions/${id}/archive`);
  
}