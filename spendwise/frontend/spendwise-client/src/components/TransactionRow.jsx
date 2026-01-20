import { TableRow, TableCell, Chip, Typography, IconButton, Box } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';

const TransactionRow = ({ tx, showArchived, onArchive, onRestore, mobileView = false }) => {
  const isExpense = tx.type === 'expense';

  if (mobileView) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {showArchived ? (
          <IconButton
            size="small"
            color="success"
            onClick={() => onRestore?.(tx._id)}
          >
            <RestoreIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            size="small"
            color="warning"
            onClick={() => onArchive?.(tx._id)}
          >
            <ArchiveIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <TableRow hover>
      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>

      <TableCell>
        <Typography fontWeight={600}>
          {tx.description}
        </Typography>
      </TableCell>

      <TableCell>{tx.account?.name || '-'}</TableCell>
      <TableCell>{tx.category?.name || '-'}</TableCell>

      <TableCell>
        <Chip
          size="small"
          label={tx.type}
          color={isExpense ? 'error' : 'success'}
        />
      </TableCell>

      <TableCell align="right">
        <Typography
          fontWeight={700}
          color={isExpense ? 'error.main' : 'success.main'}
        >
          {isExpense ? '-' : '+'}₱{Math.abs(tx.amount).toLocaleString()}
        </Typography>
      </TableCell>

      {/* Archive/Restore */}
      <TableCell align="center">
        {showArchived ? (
          <IconButton
            size="small"
            color="success"
            onClick={() => onRestore?.(tx._id)}
          >
            <RestoreIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            size="small"
            color="warning"
            onClick={() => onArchive?.(tx._id)}
          >
            <ArchiveIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;