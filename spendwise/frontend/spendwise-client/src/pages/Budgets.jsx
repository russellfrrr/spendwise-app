import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';

import api from '../api/axios.js';
import { fetchMonthlyBudgetSummary } from '../api/budgets';
import AddBudgetModal from '../components/AddBudgetModal.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import BudgetSummaryCard from '../components/BudgetSummaryCard.jsx';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showArchived, setShowArchived] = useState(false); 
  const [archivedBudgets, setArchivedBudgets] = useState([]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + (b.used ?? 0), 0);
  const totalRemaining = totalBudget - totalUsed;


  const loadBudgets = async () => {
    try {
      const [active, archived] = await Promise.all([
        fetchMonthlyBudgetSummary(),
        api.get('/budgets/archived'),
      ]);

      setBudgets(active);
      setArchivedBudgets(archived.data?.data ?? []);
    } catch (err) {
      console.error('Failed to load budgets', err);
    }
  };

  const displayed = showArchived ? archivedBudgets : budgets;

  const handleArchive = async (id) => {
    await api.patch(`/budgets/${id}/archive`);
    loadBudgets();
  };

  const handleRestore = async (id) => {
    await api.patch(`/budgets/${id}/restore`);
    loadBudgets();
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>Budgets</Typography>

        <Stack direction="row" spacing={2}>
          <Button onClick={() => setShowArchived(prev => !prev)}>
            {showArchived ? 'Show Active Budgets' : 'Show Archived Budgets'}
          </Button>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Budget
          </Button>
        </Stack>
      </Stack>
      
      {/* Summary */}
      {!showArchived && budgets.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <BudgetSummaryCard
            total={totalBudget}
            used={totalUsed}
            remaining={totalRemaining}
          />
        </Box>
      )}

      <Grid container spacing={3}>
        {displayed.length === 0 ? (
          <Grid item xs={12} textAlign="center">
            <Typography color="text.secondary">
              No budgets found.
            </Typography>
          </Grid>
        ) : (
          displayed.map(b => (
            <Grid item xs={12} md={4} lg={4} key={b._id}>
              <BudgetCard
                budget={b}
                used={b.used ?? 0}
                showArchived={showArchived}
                onEdit={setEditing}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
            </Grid>
          ))
        )}
      </Grid>


      <AddBudgetModal
        open={open || Boolean(editing)}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSuccess={() => {
          loadBudgets();
          setEditing(null);
        }}
        initialData={editing}
      />
    </Box>
  );
};

export default Budgets;