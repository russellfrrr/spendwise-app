import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const CategoryModal = ({ open, onClose, onSuccess, initialData }) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    name: '',
    type: 'expense',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        type: initialData.type,
      });
    } else {
      setForm({
        name: '',
        type: 'expense',
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
    if (!form.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (isEdit) {
        await api.patch(`/categories/${initialData._id}`, form);
      } else {
        await api.post('/categories', form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Category save failed', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Category' : 'Add Category'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            autoFocus
          />

          <TextField
            select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : 'Add Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;