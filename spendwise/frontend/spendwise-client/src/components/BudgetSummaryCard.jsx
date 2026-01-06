import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Box,
} from '@mui/material';

const BudgetSummaryCard = ({ total, used, remaining }) => {
  const overBudget = remaining < 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        borderLeft: `6px solid ${overBudget ? '#ef4444' : '#22c55e'}`,
        maxWidth: 900,
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Monthly Budget Summary
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />
          }
        >
          {/* Total */}
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Total Budget
            </Typography>
            <Typography fontWeight={700}>
              ₱{total.toLocaleString()}
            </Typography>
          </Box>

          {/* Used */}
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Used
            </Typography>
            <Typography
              fontWeight={700}
              color={overBudget ? 'error.main' : 'text.primary'}
            >
              ₱{used.toLocaleString()}
            </Typography>
          </Box>

          {/* Remaining */}
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Remaining
            </Typography>
            <Typography
              fontWeight={700}
              color={overBudget ? 'error.main' : 'success.main'}
            >
              {remaining < 0 ? '-' : ''}₱{Math.abs(remaining).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BudgetSummaryCard;