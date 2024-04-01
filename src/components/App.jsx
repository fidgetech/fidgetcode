// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import MaterialLayout from 'components/Layout/MaterialLayout';
import { StyledPaper } from 'components/Layout/SharedStyles';
import { Typography, Link } from '@mui/material';
import SignIn from 'components/SignIn';

function App() {
  return (
    <MaterialLayout>
      <StyledPaper>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Epicenter 2.0
        </Typography>
        <SignIn />
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </StyledPaper>
    </MaterialLayout>
  )
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

export default App
