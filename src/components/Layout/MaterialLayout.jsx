import { useState, useEffect } from 'react';
import { CssBaseline, useMediaQuery, Box } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { lightTheme, darkTheme, rootStyle } from './LayoutStyles';
import { Typography, Link } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { StyledPaper } from './SharedStyles';

export default function MaterialLayout({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(prefersDarkMode ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(prefersDarkMode ? darkTheme : lightTheme);
  }, [prefersDarkMode]);
  
  const toggleColorMode = () => {
    setTheme(prevTheme => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div sx={rootStyle(theme)}>
        <header>
          <Navbar toggleColorMode={toggleColorMode} />
        </header>
        <main>
          <Box sx={{ my: { xs: 0, sm: 2 } }}>
            <StyledPaper>
              {children || <Outlet />}
            </StyledPaper>
          </Box>
        </main>
      </div>
      <footer>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </footer>
    </ThemeProvider>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" target="_blank" rel="noopener" href="https://fidgetech.org/">
        Fidgetech
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
