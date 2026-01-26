import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import TransactionRow from './TransactionRow';

const TransactionTable = ({ transactions, loading, showArchived, onArchive, onRestore }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box>
        {loading ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            Loading transactions...
          </Typography>
        ) : transactions.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No transactions found.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {transactions.map(tx => (
              <Card key={tx._id} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(tx.date).toLocaleDateString()}
                        </Typography>
                        <Typography fontWeight={600}>
                          {tx.description}
                        </Typography>
                      </Box>
                      <Typography 
                        fontWeight={600} 
                        sx={{ color: tx.type === 'income' ? '#22c55e' : '#ef4444' }}
                      >
                        {tx.type === 'income' ? '+' : '-'}₱{Math.abs(tx.amount).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" sx={{ backgroundColor: '#f3f4f6', px: 1, py: 0.5, borderRadius: 1 }}>
                        {tx.account?.name}
                      </Typography>
                      {tx.category && (
                        <Typography variant="caption" sx={{ backgroundColor: '#f3f4f6', px: 1, py: 0.5, borderRadius: 1 }}>
                          {tx.category.name}
                        </Typography>
                      )}
                    </Box>

                    <TransactionRow 
                      tx={tx} 
                      showArchived={showArchived} 
                      onArchive={onArchive}
                      onRestore={onRestore}
                      mobileView={true}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(tx => (
              <TransactionRow 
                key={tx._id} 
                tx={tx} 
                showArchived={showArchived} 
                onArchive={onArchive}
                onRestore={onRestore}
                />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;