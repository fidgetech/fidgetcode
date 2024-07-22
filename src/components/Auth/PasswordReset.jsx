import { useState } from 'react';
import { auth } from 'services/firebase.js';
import { Typography, Alert, Button, Grid, Box, TextField } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import Loading from 'components/Layout/Loading';
import { useNotification } from 'contexts/NotificationContext';

export default function PasswordReset({ toggleReset }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useNotification();

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    try {
      await sendPasswordResetEmail(auth, email);
      setNotification('Sent password reset email. (It may take several minutes to arrive.)');
      toggleReset();
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  if (loading) {
    return <Loading text='Resetting password...' />;
  }

  return (
    <Box component="form" onSubmit={handlePasswordReset} noValidate sx={{ mt: 1 }}>
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
      <Typography><em>Please allow several minutes for the email to arrive.</em></Typography>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Send Reset Link
      </Button>
      <Grid container>
        <Grid item xs>
          <Button variant="text" sx={{ textTransform: 'none' }} onClick={toggleReset}>
            Back to Sign In
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}