import { Typography, Box } from '@mui/material';
import { TailSpin } from 'react-loading-icons'

export default function Loading({ text='Thinking...', isHeading=false }) {
  return (
    <Box align='center' sx={{ my: 10 }}>
      <TailSpin stroke='black' strokeWidth='2.5' />
      <Typography sx={{ mt: 5}} color={isHeading ? 'error' : 'secondary'}>
        {text}
      </Typography>
    </Box>
  );
};
