import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={toggleMobileSidebar}
        user={user}
        logout={logout}
      />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Bar */}
        <Box
          sx={{
            height: 56,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}
        >
          {isMobile && (
            <IconButton onClick={toggleMobileSidebar}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography fontWeight={700} ml={isMobile ? 2 : 0}>
            Dashboard
          </Typography>
        </Box>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            backgroundColor: '#f5f6fa',
            p: { xs: 2, md: 4 },
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;