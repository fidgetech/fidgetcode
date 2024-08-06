import { useState } from 'react';
import { Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTracks } from 'hooks/useTeacherData';
import { CopyButton } from 'shared/CopyButton';

const functions = getFunctions();
const addUser = httpsCallable(functions, 'addUser');

export const Invite = () => {
  const { tracks } = useTracks();
  const [mySelect, setMySelect] = useState('');
  const [passwordResetLink, setPasswordResetLink] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const email = data.get('email');
    const trackId = mySelect;
    if (!trackId || !name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid form data');

    try {
      const { data: { link} } = await addUser({ name, email, trackId });
      setPasswordResetLink(link);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error);
    }
  }

  if (passwordResetLink) {
    return (
      <>
        <Typography>Student successfully added :)</Typography>
        <Typography sx={{ my: 2 }}>Password reset link for use by student:</Typography>
        <Box sx={{ my: 2, p: 2, border: 1, borderRadius: 1, bgcolor: 'background.default' }}>
          <Typography>
            {passwordResetLink}
            <CopyButton text={passwordResetLink} buttonText='' />
          </Typography>
        </Box>
        <Typography>This link will time-out; have the student use this immediately or instead ask them to request their own password reset from the Code Central login page.</Typography>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Typography variant='h5' color='error'>Error adding student :(</Typography>
        <Typography variant='body1'>{error.message}</Typography>
      </>
    )
  }

  return (
    <>
      <Typography variant='h5'>Add Student</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          name="name"
          label="Full Name"
          autoComplete="off"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email"
          autoComplete="off"
        />
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="syllabus-input-label">Syllabus</InputLabel>
          <Select
            labelId="syllabus-select-label"
            id="syllabus"
            value={mySelect}
            label="Syllabus"
            required={true}
            onChange={(e) => { setMySelect(e.target.value) }}
          >
            {tracks.map((track) => (
              <MenuItem key={track.id} value={track.id}>{track.syllabus}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Add Student
        </Button>
      </Box>
    </>
  )
}
