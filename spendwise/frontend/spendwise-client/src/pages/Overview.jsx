import { Grid, Paper, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { fetchMonthlyExpenseBudgets } from '../api/budgets.js';

import {
  fetchMonthlyIncomeExpense,
  fetchTotalBalance,
} from '../api/stats.js';

import OverviewCharts from '../components/OverviewCharts.jsx';

const StatCard = ({ label, value, color }) => (
  <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>

    <Typography sx={{fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 600, color, wordBreak: 'break-word'}}>
      {value}
    </Typography>
  </Paper>
);


const Overview = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    income: 0,
    expense: 0,
    remaining: null,
  });

  useEffect(() => {
    document.title = 'Dashboard - SpendWise';
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [balanceRes, monthlyRes, budgets] = await Promise.all([
          fetchTotalBalance(),
          fetchMonthlyIncomeExpense(),
          fetchMonthlyExpenseBudgets()
        ]);

        const totalBudget = Array.isArray(budgets) ? 
          budgets.reduce((sum, b) => sum + b.amount, 0) : 0;

        const expense = monthlyRes?.expense ?? 0;

        const remaining = totalBudget > 0 ? totalBudget - expense : null;

        setStats({
          totalBalance: balanceRes?.totalBalance ?? 0,
          income: monthlyRes?.income ?? 0, 
          expense,
          remaining,
        });

      } catch (err) {
        console.error('Failed to load overview stats', err);
      } 
    }

    loadStats();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
        <Box sx={{ maxWidth: 1100, px: { xs: 1, sm: 0 } }}>
        <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
          Overview
        </Typography>

        {/* STATS ROW */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Balance"
              value={`₱${stats.totalBalance.toLocaleString()}`}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Monthly Income"
              value={`₱${stats.income.toLocaleString()}`}
              color="green"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Monthly Expense"
              value={`₱${stats.expense.toLocaleString()}`}
              color="red"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Remaining Budget (Monthly)"
              value={
                stats.remaining === null
                  ? '-'
                  : `₱${stats.remaining.toLocaleString()}`
              }
            />
          </Grid>
        </Grid>

        {/* CHARTS ROW */}
        <Box sx={{ mt: { xs: 4, md: 6 }, width: '100%' }}>
          <Paper sx={{ p: {xs: 2, sm: 3}, width: '100%', maxWidth: 1100, mx: 'auto' }}>
            <OverviewCharts
              income={stats.income}
              expense={stats.expense}
              monthlyExpenses={stats.expense > 0 ? [{ month: 'This month: ', amount: stats.expense }] : 0}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Overview;