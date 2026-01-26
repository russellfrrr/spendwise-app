import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';

const BudgetCard = ({
  budget,
  used = 0,
  showArchived,
  onEdit,
  onArchive,
  onRestore,
}) => {
  const percent = budget.amount > 0 ? Math.min((used / budget.amount) * 100, 100) : 0;

  const remaining = budget.amount - used;
  const overBudget = remaining < 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        borderLeft: `5px solid ${
          overBudget ? '#ef4444' : '#3b82f6'
        }`,
      }}
    >
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={600}>
            {budget.category?.name}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {!showArchived && (
              <>
                <IconButton
                  size="small"
                  onClick={() => onEdit(budget)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => onArchive(budget._id)}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </>
            )}

            {showArchived && (
              <IconButton
                size="small"
                color="success"
                onClick={() => onRestore(budget._id)}
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Amount */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          ₱{used.toLocaleString()} / ₱{budget.amount.toLocaleString()}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ my: 1, height: 8, borderRadius: 1 }}
          color={overBudget ? 'error' : 'primary'}
        />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Typography
            variant="caption"
            color={overBudget ? 'error' : 'text.secondary'}
          >
            Remaining: {remaining < 0 ? '-' : ''}₱{Math.abs(remaining).toLocaleString()}
          </Typography>

          {overBudget && (
            <Chip
              size="small"
              color="error"
              label="Over budget"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;