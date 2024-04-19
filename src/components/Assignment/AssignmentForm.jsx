import { useState } from 'react';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';
import Loading from 'components/Layout/Loading';
import { useAuth } from 'contexts/AuthContext';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import { serverTimestamp } from 'firebase/firestore';

export const AssignmentForm = ({ assignment }) => {
  const { currentUser } = useAuth();
  const { loading, error, submitData } = useFirestoreSubmit();
  const [ validationError, setValidationError ] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError(null);
    const data = new FormData(event.currentTarget);
    const url = data.get('url');
    if (!url.includes('github.com/')) {
      setValidationError('URL must be a GitHub repository');
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const collectionPath = ['students', currentUser.uid, 'assignments', assignment.id, 'submissions'];
    const submissionId = await submitData(collectionPath, {
      studentId: currentUser.uid,
      assignmentId: assignment.id,
      url: normalizedUrl,
      createdAt: serverTimestamp(),
    });
    if (submissionId) {
      console.log('Submission created with ID:', submissionId);

    }
  };

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  if (assignment.status === 'submitted') {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Your project has been submitted and is awaiting review.
      </Alert>
    );
  }

  return (
    <>
      <Typography variant='h5'>Submit your project below</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {(error || validationError) && <Alert severity="error" sx={{ mt: 2 }}>{error?.message || validationError}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="url"
          name="url"
          label="GitHub repo URL"
          autoComplete="off"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit project
        </Button>
      </Box>
    </>
  );
}
