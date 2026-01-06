import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import TransactionRow from './TransactionRow';

const TransactionTable = ({ transactions, loading, showArchived, onArchive, onRestore }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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