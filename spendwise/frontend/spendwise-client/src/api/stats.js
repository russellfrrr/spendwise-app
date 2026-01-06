import api from './axios.js';

export const fetchMonthlyIncomeExpense = async () => {
  const res = await api.get('/stats/monthly/income-expense');

  return res.data.data;
}

export const fetchTotalBalance = async () => {
  const res = await api.get('/stats/total-balance');

  return res.data.data;
}

