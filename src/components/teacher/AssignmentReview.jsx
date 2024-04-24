import { useState, useMemo } from 'react';
import { Alert, Box, Typography, List, ListItem, ListItemText, MenuItem, FormControl, Select, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NoteField } from 'shared/NoteField';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import { serverTimestamp } from 'firebase/firestore';
import { useAssignmentSubmissions } from 'hooks/useTeacherData';
import Loading from 'components/Layout/Loading';

export const AssignmentReview = ({ assignment }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [note, setNote] = useState('');
  const theme = useTheme();
  const { loading, error, updateData } = useFirestoreSubmit();
  const [ validationError, setValidationError ] = useState(null);
  const { submissions } = useAssignmentSubmissions({ studentId: assignment.studentId, assignmentId: assignment.id });
  const latestSubmission = useMemo(() => submissions[submissions.length -1], [submissions]);

  const handleChange = (objectiveNum, event) => {
    setSelectedOptions(prev => ({ ...prev, [objectiveNum]: event.target.value }));
  };

  const getBackgroundColor = (value) => {
    switch (value) {
      case 'all': return theme.palette.green.main;
      case 'some': return theme.palette.orange.main;
      case 'none': return theme.palette.red.main;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError(null);
    const data = new FormData(event.currentTarget);
    if (!note || Object.keys(selectedOptions).length !== assignment.objectives.length) {
      setValidationError('Please fill out all fields');
      return;
    }
    const docPath = ['students', assignment.studentId, 'assignments', assignment.id, 'submissions', latestSubmission.id];
    const updatedSubmission = {
      ...latestSubmission,
      review: {
        objectives: selectedOptions,
        note,
        reviewedAt: serverTimestamp(),
      },
    };
    await updateData(docPath, updatedSubmission);
    console.log('Review submitted:', updatedSubmission);
  }

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {(error || validationError) && <Alert severity="error" sx={{ my: 2 }}>{error?.message || validationError}</Alert>}
      <Typography variant='h5' gutterBottom>Review Submission</Typography>
      <List>
        {assignment.objectives.map((objective) => (
          <ListItem key={objective.number} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ListItemText primary={objective.content} />
            <FormControl sx={{ m: 1, minWidth: 300 }}>
              <Select
                value={selectedOptions[objective.number] || ''}
                onChange={(event) => handleChange(objective.number, event)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ backgroundColor: getBackgroundColor(selectedOptions[objective.number]) }}
              >
                <MenuItem value='none'><em>Does not meet this standard yet</em></MenuItem>
                <MenuItem value='some'><em>Meets standard some of the time</em></MenuItem>
                <MenuItem value='all'><em>Meets standard all of the time</em></MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        ))}
      </List>
      <NoteField label='Note to student (supports markdown)' onChange={(e) => setNote(e.target.value)} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!note || Object.keys(selectedOptions).length !== assignment.objectives.length}
      >
        Submit review
      </Button>
    </Box>
  );
}
