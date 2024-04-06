import { useState } from 'react';
import { auth } from 'src/firebase.js';
import { useAuth } from 'components/Auth/AuthContext';
import { Alert, Button, Grid, Box, TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loading from 'components/Layout/Loading';

export default function SignIn({ toggleReset }) {
  const [error, setError] = useState(null);
  const { loading, setLoading } = useAuth();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  if (loading) {
    return <Loading text='Signing in...' />;
  }

  return (
    <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Button variant="text" sx={{ textTransform: 'none' }} onClick={toggleReset}>
            Forgot password?
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
