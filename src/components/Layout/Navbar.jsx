import { useState } from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import ColorModeToggle from 'components/Layout/ColorModeToggle';
import { useAuth } from 'contexts/AuthContext';

export const StaticNavbar = () => {
  const { currentUser, isSignedIn, signOut } = useAuth();
  const [accountMenuAccountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAccountMenuAnchorEl);
  const handleToggleAccountMenu = (event) => {
    setAccountMenuAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" sx={{ padding: '6px 16px', borderRadius: '4px' }}>Fidgetech Code</Typography>
          <Box>
            {isSignedIn && (
              <>
                <Button color="inherit" onClick={handleToggleAccountMenu}>
                  {currentUser.name}
                </Button>
                <Menu anchorEl={accountMenuAccountMenuAnchorEl} open={accountMenuOpen} onClose={handleToggleAccountMenu}>
                  <MenuItem onClick={(e) => { signOut(); handleToggleAccountMenu(e); }}>Sign Out</MenuItem>
                </Menu>
              </>
            )}
            <ColorModeToggle />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export const Navbar = () => {
  const { currentUser, isSignedIn, signOut } = useAuth();
  const [accountMenuAccountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAccountMenuAnchorEl);
  const [hamburgerMenuAnchorEl, setHamburgerMenuAnchorEl] = useState(null);
  const hamburgerMenuOpen = Boolean(hamburgerMenuAnchorEl);
  const location = useLocation();

  const handleToggleAccountMenu = (event) => {
    setAccountMenuAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  const handleToggleHamburgerMenu = (event) => {
    setHamburgerMenuAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* hamburger menu for xs screns; only when logged in */}
        <Box sx={{ flexGrow: 1, display: { xs: isSignedIn ? 'flex' : 'none', sm: 'none' } }}>
          <IconButton size="large" color="inherit" aria-label="open drawer" onClick={handleToggleHamburgerMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={hamburgerMenuAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={hamburgerMenuOpen}
            onClose={handleToggleHamburgerMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuItem onClick={handleToggleHamburgerMenu}>
              <Typography textAlign="center">A Menu Item</Typography>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography component={Link} to='/' variant="h6" color='inherit' sx={{
              textDecoration: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              display: { xs: isSignedIn ? 'none' : 'flex', sm: 'flex' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            Fidgetech Code
          </Typography>

          <Box>
            {isSignedIn ? (
              <>
                <Button color="inherit" onClick={handleToggleAccountMenu}>
                  {currentUser.name}
                </Button>
                <Menu anchorEl={accountMenuAccountMenuAnchorEl} open={accountMenuOpen} onClose={handleToggleAccountMenu}>
                  <MenuItem onClick={(e) => { signOut(); handleToggleAccountMenu(e); }}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {location.pathname !== '/login' &&
                  <Button color="inherit" component={Link} to="/login">
                    Sign In
                  </Button>
                }
              </>
            )}
            <ColorModeToggle />
          </Box>

        </Box>
      </Toolbar>
    </AppBar>
  );
};
