import { useState } from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import ColorModeToggle from 'components/Layout/ColorModeToggle';

import { useAuth } from 'components/Auth/AuthContext';

const Navbar = ({ toggleColorMode }) => {
  const { currentUser, signOut } = useAuth();
  const [accountMenuAccountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAccountMenuAnchorEl);
  const [hamburgerMenuAnchorEl, setHamburgerMenuAnchorEl] = useState(null);
  const hamburgerMenuOpen = Boolean(hamburgerMenuAnchorEl);

  const handleToggleAccountMenu = (event) => {
    setAccountMenuAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  const handleToggleHamburgerMenu = (event) => {
    setHamburgerMenuAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* hamburger menu for xs screns */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
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

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
          Epicenter 2.0
        </Typography>
        {currentUser ? (
          <>
            <Button color="inherit" onClick={handleToggleAccountMenu}>
              {currentUser.email}
            </Button>
            <Menu anchorEl={accountMenuAccountMenuAnchorEl} open={accountMenuOpen} onClose={handleToggleAccountMenu}>
              <MenuItem onClick={(e) => { signOut(); handleToggleAccountMenu(e); }}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Sign In
          </Button>
        )}
        <ColorModeToggle toggleColorMode={toggleColorMode} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
