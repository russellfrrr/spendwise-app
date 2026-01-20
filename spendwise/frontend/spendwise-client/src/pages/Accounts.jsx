import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [archived, setArchived] = useState([]);
  const [open, setOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    document.title = 'Accounts - SpendWise';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    balance: '',
  });

  
  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const [activeRes, archivedRes] = await Promise.all([
        api.get('/accounts'),
        api.get('/accounts/archived'),
      ]);

      setAccounts(activeRes.data?.data ?? []);
      setArchived(archivedRes.data?.data ?? []);
    } catch (err) {
      console.error('Failed to fetch accounts', err);
      setAccounts([]);
      setArchived([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAccounts();
  }, []);

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        await api.patch(`/accounts/${editingAccount._id}`, {
          name: formData.name,
          type: formData.type,
        });
      } else {
        await api.post('/accounts', {
          ...formData,
          balance: Number(formData.balance) || 0,
        });
      }

      setFormData({ name: '', type: '', balance: '' });
      setEditingAccount(null);
      setOpen(false);
      fetchAccounts();
    } catch (err) {
      console.error('Save account failed', err);
    }
  };


  const handleArchive = async (id) => {
    await api.patch(`/accounts/${id}/archive`);
    fetchAccounts();
  };

  const handleRestore = async (id) => {
    await api.patch(`/accounts/${id}/restore`);
    fetchAccounts();
  };

  const displayed = showArchived ? archived : accounts;


  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={700}>
            Accounts
          </Typography>

          <Chip
            label={showArchived ? 'Archived Accounts' : 'Active Accounts'}
            color={showArchived ? 'warning' : 'success'}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column-reverse', md: 'row' }, width: { xs: '100%', md: 'auto' } }}>
          <Button
            onClick={() => setShowArchived(prev => !prev)}
            fullWidth={{ xs: true, md: false }}
          >
            {showArchived ? 'Show Active Accounts' : 'Show Archived Accounts'}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            fullWidth={{ xs: true, md: false }}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      {/* Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} textAlign="center">
            <Typography color="text.secondary">
              Loading accounts…
            </Typography>
          </Grid>
        ) : displayed.length === 0 ? (
          <Grid item xs={12} textAlign="center">
            <Typography color="text.secondary">
              No accounts found.
            </Typography>
          </Grid>
        ) : (
          displayed.map((account) => {
            const canArchive = Number(account.balance) === 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={account._id}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography fontWeight={600}>
                      {account.name}
                    </Typography>

                    <Chip
                      label={account.type}
                      size="small"
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <Typography variant="h6">
                      ₱{Number(account.balance || 0).toLocaleString()}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      {!showArchived && (
                        <Tooltip title="Edit account name">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingAccount(account);
                              setFormData({
                                name: account.name,
                                type: account.type,
                                balance: account.balance,
                              });
                              setOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {showArchived ? (
                        <IconButton
                          color="success"
                          onClick={() => handleRestore(account._id)}
                        >
                          <RestoreIcon />
                        </IconButton>
                      ) : (
                        <Tooltip
                          title={
                            canArchive
                              ? 'Archive account'
                              : 'Account balance must be ₱0 to archive'
                          }
                        >
                          <span>
                            <IconButton
                              color="warning"
                              disabled={!canArchive}
                              onClick={() => handleArchive(account._id)}
                            >
                              <ArchiveIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingAccount(null);
          setFormData({ name: '', type: '', balance: '' });
        }}
        fullWidth
      >

        <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Account Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            select
            fullWidth
            label="Account Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            sx={{ mb: 2 }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank">Bank</MenuItem>
            <MenuItem value="ewallet">E-wallet</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Initial Balance"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            disabled={Boolean(editingAccount)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingAccount ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;