import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';

const COLORS = ['#22c55e', '#ef4444'];

const OverviewCharts = ({ income, expense, monthlyExpenses }) => {
  const hasPieData = income > 0 || expense > 0;
  const hasBarData =
    Array.isArray(monthlyExpenses) && monthlyExpenses.length > 0;

  return (
    <Grid container spacing={3}>
      {/* PIE CHART */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', minHeight: 300, minWidth: 500 }}>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Income vs Expense
            </Typography>

            {hasPieData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Income', value: income },
                      { name: 'Expense', value: expense },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ mt: 12 }}
              >
                No income or expense data yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* BAR CHART */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', minHeight: 300, minWidth: 500 }}>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Monthly Expenses
            </Typography>

            {hasBarData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyExpenses}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ mt: 12 }}
              >
                No expense data to display.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OverviewCharts;

