import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
export { drawerWidth };

const Sidebar = ({ open, onClose, user, logout, variant }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Top */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          SpendWise
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: 'Overview', path: '/dashboard' },
          { text: 'Accounts', path: '/dashboard/accounts' },
          { text: 'Transactions', path: '/dashboard/transactions' },
          { text: 'Budgets', path: '/dashboard/budgets' },
        ].map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (variant === 'temporary') onClose();
              }}
              sx={{
                cursor: 'pointer',
                mx: 1,
                borderRadius: 1,
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" fontWeight={600}>
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: 'pointer', color: 'error.main' }}
          onClick={logout}
        >
          Logout
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;