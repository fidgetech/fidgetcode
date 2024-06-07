import { useState } from 'react';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';
import Loading from 'components/Layout/Loading';
import { useAuth } from 'contexts/AuthContext';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import { serverTimestamp } from 'firebase/firestore';
import { queryClient } from 'lib/queryClient';
import DOMPurify from 'dompurify';
import { NoteField } from 'shared/NoteField';

export const AssignmentForm = ({ assignment, setAssignmentStatus }) => {
  const { currentUser } = useAuth();
  const { loading, error, createData } = useFirestoreSubmit();
  const [ validationError, setValidationError ] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError(null);
    const data = new FormData(event.currentTarget);
    const url = DOMPurify.sanitize(data.get('url'));
    if (!url || !url.includes('github.com/')) {
      setValidationError('URL must be a GitHub repository');
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const collectionPath = ['students', currentUser.uid, 'assignments', assignment.id, 'submissions'];
    const submissionId = await createData(collectionPath, {
      studentId: currentUser.uid,
      assignmentId: assignment.id,
      url: normalizedUrl,
      note: data.get('note'),
      createdAt: serverTimestamp(),
    });
    if (submissionId) {
      console.log('Submission created with ID:', submissionId);
      setAssignmentStatus('submitted');
      setTimeout(() => {
        queryClient.invalidateQueries(['assignment', currentUser.uid, assignment.id]);
      }, 1000);
    }
  };

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  return (
    <>
      <Typography variant='h5'>Submit your project below</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {(error || validationError) && <Alert severity="error" sx={{ my: 2 }}>{error?.message || validationError}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="url"
          name="url"
          label="GitHub repo URL"
          autoComplete="off"
        />
        <NoteField label='Note (optional)' />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit project
        </Button>
      </Box>
    </>
  );
}
