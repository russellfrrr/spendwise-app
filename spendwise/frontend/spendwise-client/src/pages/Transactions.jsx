import {
  Box,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useReducer, useState } from 'react';

import api from '../api/axios';
import { fetchCategories } from '../api/categories.js';
import { fetchAccounts } from '../api/accounts.js';

import TransactionTable from '../components/TransactionTable.jsx';
import TransactionModal from '../components/TransactionModal.jsx';
import CategoryModal from '../components/CategoryModal.jsx';
import CategorySelect from '../components/CategorySelect.jsx';

import {
  transactionsReducer,
  initialTransactionState,
} from '../context/transactionsReducer';

const Transactions = () => {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts ] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const [state, dispatch] = useReducer(
    transactionsReducer,
    initialTransactionState
  );

  const { loading, filter } = state;

  // fetch transactions
  const fetchTransactions = async () => {
    try {
      dispatch({ type: 'FETCH_START' });

      const [activeRes, archivedRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/archived'),
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          active: activeRes.data?.data ?? [],
          archived: archivedRes.data?.data ?? [],
        },
      });
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: err.message,
      });
    }
  };

  const sortByDateDesc = (list) => [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const source = showArchived ? state.archived : state.transactions;

  const displayed = sortByDateDesc(
    source.filter(tx => {
      const typeMatch = filter === 'all' || tx.type === filter;
      const categoryMatch = !selectedCategory || tx.category?._id === selectedCategory;

      return typeMatch && categoryMatch;
    })
  );

  
  const handleArchive = async (id) => {
    await api.patch(`/transactions/${id}/archive`);
    fetchTransactions();
  };

  const handleRestore = async (id) => {
    await api.patch(`/transactions/${id}/restore`);
    fetchTransactions();
  };


  const fetchMeta = async () => {
    try {
      const [accountsData, categoriesData] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
      ]);

      setAccounts(accountsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch meta data', err);
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchMeta();
  }, []);



  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            Transactions
          </Typography>

          <Chip
            label={showArchived ? 'Archived Transactions' : 'Active Transactions'}
            color={showArchived ? 'warning' : 'success'}
            size="small"
          />
        </Box>


        <Stack direction="row" spacing={2}>
          <Button onClick={() => setShowArchived(prev => !prev)}>
            {showArchived
              ? 'Show Active Transactions'
              : 'Show Archived Transactions'}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Transaction
          </Button>
        </Stack>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        {/* Type filter */}
        <FormControl size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={filter}
            label="Type"
            onChange={(e) =>
              dispatch({
                type: 'SET_FILTER',
                payload: e.target.value,
              })
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>

        {/* Category CRUD selector */}
        <CategorySelect
          categories={categories.filter(c => !c.isDeleted)}
          value={selectedCategory}
          onChange={setSelectedCategory}
          onAdd={() => setCategoryOpen(true)}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setCategoryOpen(true);
          }}
          onArchive={async (id) => {
            if (!window.confirm('Archive this category?')) return;
            await api.patch(`/categories/${id}/archive`);
            fetchMeta();
            setSelectedCategory('');
          }}
        />
      </Stack>


      {/* Table */}
      <TransactionTable
        transactions={displayed}
        loading={loading}
        showArchived={showArchived}
        onArchive={handleArchive}
        onRestore={handleRestore}
      />

      {/* Transaction Modal */}
      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchTransactions}
        accounts={accounts}
        categories={categories}
      />

      {/* Category Modal */}
      <CategoryModal
        open={categoryOpen}
        onClose={() => {
          setCategoryOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={fetchMeta}
        initialData={editingCategory}
      />
    </Box>
  );
};

export default Transactions;