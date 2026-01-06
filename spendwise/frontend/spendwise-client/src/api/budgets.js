import api from '../api/axios.js';

// for overview stats
export const fetchMonthlyExpenseBudgets = async () => {
  const res = await api.get('/budgets/monthly/expense');

  return res.data.data;
}

// for ui
export  const fetchBudgets = async () => {
  const res = await api.get('/budgets');

  return res.data.data;
}

export const createBudget = async (data) => {
  const res = await api.post('/budgets', data);

  return res.data.data;
}

export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}`);

  return res.data.data;
}

export const fetchMonthlyBudgetSummary = async () => {
  const res = await api.get('/budgets/monthly/summary');

  return res.data.data;
}