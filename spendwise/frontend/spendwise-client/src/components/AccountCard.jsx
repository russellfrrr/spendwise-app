import { Card, CardContent, Typography } from '@mui/material';

const AccountCard = ({ name, balance, type }) => {
  const isNegative = balance < 0;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {type}
        </Typography>

        <Typography variant="h6" sx={{ mt: 1 }}>
          {name}
        </Typography>

        <Typography variant ="h5" sx={{ mt: 2, fontWeight: 700, color: isNegative ? 'error.main' : 'success.main' }}>
          ₱{balance.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default AccountCard;