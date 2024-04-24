import { useNotification } from 'contexts/NotificationContext';
import { Alert } from '@mui/material';

export const Notification = () => {
  const { message } = useNotification();

  if (!message) return null;

  return (
    <Alert severity="info" sx={{ width: '100%', zIndex: 1000, mb: 2 }}>
      {message}
    </Alert>
  );
};
