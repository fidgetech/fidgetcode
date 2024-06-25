import { CssBaseline, Box, Typography, Link } from '@mui/material';
import { useCustomTheme } from 'contexts/ThemeContext';
import { rootStyle } from 'themes/LayoutStyles';
import { StyledPaper } from './SharedStyles';
import { Navbar, StaticNavbar } from './Navbar';
import CustomBreadcrumbs from './Breadcrumbs';

export default function MaterialLayout({ children, staticNavbar=false }) {
  const { theme } = useCustomTheme();

  return (
    <>
      <CssBaseline />
      <div sx={rootStyle(theme)}>
        <header>
          {staticNavbar ? <StaticNavbar /> : <Navbar />}
        </header>
        <main>
          <Box sx={{ my: { xs: 0, sm: 2 } }}>
            <StyledPaper>
              <CustomBreadcrumbs />
              {children}
            </StyledPaper>
          </Box>
        </main>
      </div>
      <footer>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </footer>
    </>
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
