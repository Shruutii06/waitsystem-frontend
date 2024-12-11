import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Avatar, Typography, Drawer, Switch } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Icons for light/dark mode
import { useSelector } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import navConfig from './NavConfig';

const DRAWER_WIDTH = 255;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  onThemeToggle: PropTypes.func, // Add this prop for theme toggle function
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, onThemeToggle }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const authData = useSelector(({ auth }) => auth);

  const account = {
    displayName: authData.user.name,
    email: authData.user.email,
  };

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname, isOpenSidebar, onCloseSidebar]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ marginLeft: 7, px: 2.5, py: 3, display: 'inline-flex',mt: 0}}>
        <Logo />
      </Box>

      <Box sx={{ mb: 3, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={authData.user.photo || account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {/* Theme Toggle Button */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          Theme
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Brightness7 sx={{ mr: 1, color: 'warning.main' }} />
          <Switch
            onChange={onThemeToggle} // This will trigger the theme toggle function
            sx={{
              transform: 'scale(1.5)', // Increase the size of the switch
            }}
          />
          <Brightness4 sx={{ ml: 1, color: 'primary.main' }} />
        </Box>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
