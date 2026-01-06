import api from './axios.js';

export const fetchAccounts = async () => {
  const res = await api.get('/accounts');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const fetchArchivedAccounts = async () => {
  const res = await api.get('/accounts/archived');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

