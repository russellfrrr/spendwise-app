import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import api from '../api/axios';
import { fetchCategories } from '../api/categories';

const AddBudgetModal = ({ open, onClose, onSuccess, initialData }) => {
  const [form, setForm] = useState({
    category: '',
    amount: '',
    period: 'monthly',
  });

  const [categories, setCategories] = useState([]);
  const isEdit = Boolean(initialData);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category?._id ?? '',
        amount: initialData.amount ?? '',
        period: initialData.period ?? 'monthly',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      period: 'monthly',
    };

    if (isEdit) {
      await api.patch(`/budgets/${initialData._id}`, payload);
    } else {
      await api.post('/budgets', payload);
    }

    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isEdit ? 'Edit Budget' : 'Add Budget'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
          >
            {categories
              .filter(c => c.type === 'expense')
              .map(cat => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Budget period: Monthly
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : 'Create Budget'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBudgetModal;