import { Box, Typography } from '@mui/material';
import { TailSpin } from 'react-loading-icons'
import MaterialLayout from './MaterialLayout';

export default function Loading({ text='Thinking...', isHeading=false, fullScreen=false }) {
  return fullScreen ?
    <MaterialLayout staticNavbar={true}>
      <LoadingContent text={text} isHeading={isHeading} />
    </MaterialLayout>
  :
    <LoadingContent text={text} isHeading={isHeading} />;
};

const LoadingContent = ({ text, isHeading }) => {
  return (
    <Box align='center' sx={{ my: 10 }}>
      <TailSpin stroke='black' strokeWidth='2.5' />
      <Typography sx={{ mt: 5}} color={isHeading ? 'error' : 'secondary'}>
        {text}
      </Typography>
    </Box>
  );
}
