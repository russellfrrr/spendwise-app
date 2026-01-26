import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { createTransaction } from '../api/transactions';

const TransactionModal = ({
  open,
  onClose,
  onSuccess,
  accounts = [],
  categories = [],
}) => {
  const [form, setForm] = useState({
    amount: '',
    type: '',
    account: '',
    category: '',
    date: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors(prev => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.amount) newErrors.amount = 'Amount is required';
    if (!form.type) newErrors.type = 'Type is required';
    if (!form.account) newErrors.account = 'Account is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createTransaction({
        amount: Number(form.amount),
        type: form.type,
        account: form.account,
        category: form.category,
        date: form.date,
        description: form.notes,
      });

      setForm({
        amount: '',
        type: '',
        account: '',
        category: '',
        date: '',
        notes: '',
      });

      onClose();
      onSuccess();
    } catch (err) {
      setApiError(
        err?.response?.data?.message || 'Failed to create transaction'
      );
    }
  };

  useEffect(() => {
  if (open) {
    setForm({
      amount: '',
      type: '',
      account: '',
      category: '',
      date: '',
      notes: '',
    });
    setErrors({});
    setApiError('');
  }
}, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              fullWidth
            />

            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              fullWidth
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>

            <TextField
              select
              label="Account"
              name="account"
              value={form.account}
              onChange={handleChange}
              error={!!errors.account}
              helperText={errors.account}
              fullWidth
            >
              {accounts.map(acc => (
                <MenuItem key={acc._id} value={acc._id}>
                  {acc.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              fullWidth
            >
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              fullWidth
            />

            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !form.amount ||
              !form.type ||
              !form.account ||
              !form.category ||
              !form.date
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!apiError}
        autoHideDuration={4000}
        onClose={() => setApiError('')}
      >
        <Alert severity="error" onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionModal;