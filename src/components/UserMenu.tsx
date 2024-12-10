import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; 
import LoginPopup from './LoginPopup';

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void; 
}

const UserMenu: React.FC<UserMenuProps> = ({ isLoggedIn, onLogout, onLogin }) => {
  const [isLoginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const username = isLoggedIn ? localStorage.getItem('username') : null;
  const handleLoginOpen = () => setLoginPopupOpen(true);
  const handleLoginClose = () => setLoginPopupOpen(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Weekly Meal Planner App
          </Typography>

          {/* Public Menu Items */}
          <Tooltip title="Search for Recipes">
            <Button component={Link} to="/" color="inherit">
              Recipe Search
            </Button>
          </Tooltip>

          {/* Logged-in Menu Items */}
          {isLoggedIn ? (
            <>
              <Tooltip title="Add Ingredients">
                <Button component={Link} to="/config" color="inherit">
                  Add Ingredients
                </Button>
              </Tooltip>
              <Tooltip title="View Weekly Calendar">
                <Button component={Link} to="/weeklycalendar" color="inherit">
                  Weekly Calendar
                </Button>
              </Tooltip>
              <Tooltip title="Access Dashboard">
                <Button component={Link} to="/dashboard" color="inherit">
                  Dashboard
                </Button>
              </Tooltip>
              <Tooltip title="View Analytics">
                <Button component={Link} to="/analytics" color="inherit">
                  Analytics
                </Button>
              </Tooltip>
              <Tooltip title="Available Recipes">
                <Button component={Link} to="/recipe-recommendations" color="inherit">
                  Available Recipes
                </Button>
              </Tooltip>
              <Box display="flex" alignItems="center" ml={2}>
                <Tooltip title={username || 'User'}>
                  <Avatar alt={username || 'User'} src="" sx={{ bgcolor: 'secondary.main' }}>
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </Tooltip>
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {username || 'User'}
                </Typography>
              </Box>
              <Tooltip title="Logout">
                <IconButton onClick={onLogout} color="inherit" sx={{ marginLeft: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Log in to your account">
              <Button onClick={handleLoginOpen} color="inherit">
                Login
              </Button>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* Login Popup */}
      {!isLoggedIn && (
        <LoginPopup open={isLoginPopupOpen} onClose={handleLoginClose} onLogin={onLogin} />
      )}
    </>
  );
};

export default UserMenu;
