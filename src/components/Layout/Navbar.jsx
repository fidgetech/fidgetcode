import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, ListItem, Box, IconButton, Menu, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ColorModeToggle from './ColorModeToggle';

const pages = [
  // { title: 'Home', path: '/' },
];

const TITLE = 'Epicenter 2.0';
const REGISTRATION_ONLY = false;

const row1 = pages.slice(0, 5);
const row2 = pages.slice(5);

export default function Navbar({ toggleColorMode }) {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const contentMultiline = (
    <>
      {/* hamburger menu for xs and sm screens */}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit" aria-label="navigation menu" aria-controls="menu-appbar" aria-haspopup="true">
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {pages.map((page) => (
            <Link
              to={page.path}
              key={page.title}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={handleCloseNavMenu}
            >
              <ListItem>
                <Typography textAlign="center">{page.title}</Typography>
              </ListItem>
            </Link>
          ))}
        </Menu>
      </Box>

      {/* brand icon */}
      <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
        <Link to='/'>
          {/* <img src={import.meta.env.BASE_URL + '/logo.png'} alt="" style={{ margin: '10px 10px 10px 0px' }}/> */}
        </Link>
      </Box>

      <Box sx={{ display: { xs: 'inline', sm: 'inline', md: 'none' } }}>
        <Link to='/'>
          {/* <img src={import.meta.env.BASE_URL + '/logo.png'} alt="" style={{ margin: '10px 10px 10px 0px', height: '80px' }}/> */}
        </Link>
      </Box>

      {/* 2 line navbar for md screens */}
      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex', lg: 'none' }, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 0 }}>
          <PageLinks pages={row1} onClick={handleCloseNavMenu} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <PageLinks pages={row2} onClick={handleCloseNavMenu} />
        </Box>
      </Box>

      {/* 1 line navbar for lg and up screens */}
      <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' } }}>
        <PageLinks pages={pages} onClick={handleCloseNavMenu} />
      </Box>
    </>
  );

  const contentRegistrationOnly = (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
        {/* <img src={import.meta.env.BASE_URL + '/logo.png'} alt="" style={{ margin: '10px 10px 10px 0px' }}/> */}
      </Box>
      <ListItem sx={{ display: {xs: 'none', sm: 'block' }, my: 2, color: 'inherit' }}>
        <Typography variant="h4" textAlign="center">{TITLE}</Typography>
      </ListItem>
      <ListItem sx={{ display: {xs: 'block', sm: 'none' }, my: 2, color: 'inherit' }}>
        <Typography variant="h5" textAlign="center">{TITLE}</Typography>
      </ListItem>
    </>
  );

  return (
    // <AppBar position="relative" color="default" sx={{ height: '100px' }}>
    <AppBar position="relative" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          { REGISTRATION_ONLY ? contentRegistrationOnly : contentMultiline }

          {/* color mode toggle always goes to the right */}
          <ColorModeToggle toggleColorMode={toggleColorMode} />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

const PageLinks = ({ pages, onClick }) => (
  pages.map((page) => (
    <Link
      to={page.path}
      key={page.title}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onClick={onClick}
    >
      <ListItem sx={{ my: 1, color: 'inherit', display: 'block', pt: 0, pb: 0 }}>
        {page.title}
      </ListItem>
    </Link>
  ))
);
