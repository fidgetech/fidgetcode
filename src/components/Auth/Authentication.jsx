import { useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import PasswordReset from './PasswordReset';
import { Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Avatar, Container, Box } from '@mui/material';

export default function Authentication() {
  const [showReset, setShowReset] = useState(false);
  const { isSignedIn } = useAuth();

  const toggleReset = () => setShowReset((prev) => !prev);

  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mt: 4 }}>
        Epicenter 2.0
      </Typography>

      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {showReset ? <LockResetIcon /> : <LockOutlinedIcon />}
          </Avatar>
          <Typography component="h1" variant="h5">
            {showReset ? 'Reset Password' : 'Sign in'}
          </Typography>
          {showReset ? <PasswordReset toggleReset={toggleReset} /> : <SignIn toggleReset={toggleReset} />}
        </Box>
      </Container>
    </>
  );
}
