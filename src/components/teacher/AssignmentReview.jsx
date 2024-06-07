import { useState, useMemo } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { Alert, Box, Typography, List, ListItem, ListItemText, MenuItem, FormControl, Select, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import { serverTimestamp } from 'firebase/firestore';
import { useAssignmentSubmissions } from 'hooks/useTeacherData';
import Loading from 'components/Layout/Loading';
import { TextAreaInput, SelectInput } from 'shared/Inputs.jsx';
import { set } from 'firebase/database';

const generateInitialValues = (objectives) => {
  let initialValues = { note: '', objectives: {} };
  objectives.forEach(objective => {
    initialValues.objectives[objective.number] = '';
  });
  return initialValues;
};

const selectOptions = [
  { value: 'none', label: 'Does not meet this standard yet' },
  { value: 'some', label: 'Meets standard some of the time' },
  { value: 'all', label: 'Meets standard all of the time' }
];

export const AssignmentReview = ({ assignment }) => {
  console.log('rendering AssignmentReview')
  const theme = useTheme();
  const { loading, error, updateData } = useFirestoreSubmit();
  const [ validationError, setValidationError ] = useState(null);
  const [ submitted, setSubmitted ] = useState(false);
  const { submissions } = useAssignmentSubmissions({ studentId: assignment.studentId, assignmentId: assignment.id });
  const latestSubmission = useMemo(() => submissions[0], [submissions]);

  const getBackgroundColor = (value) => {
    switch (value) {
      case 'all': return theme.palette.green.main;
      case 'some': return theme.palette.orange.main;
      case 'none': return theme.palette.red.main;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values)
    setValidationError(null);
    const { objectives, note } = values;
    if (!note || Object.keys(objectives).some(key => !objectives[key])) {
      setValidationError('Please fill out all fields');
      return;
    }
    const status = Object.values(objectives).every(value => value === 'all') ? 'pass' : 'fail';
    const docPath = ['students', assignment.studentId, 'assignments', assignment.id, 'submissions', latestSubmission.id];
    const updatedSubmission = {
      ...latestSubmission,
      review: {
        objectives,
        note,
        status,
        reviewedAt: serverTimestamp(),
      },
    };
    await updateData(docPath, updatedSubmission);
    console.log('Review submitted:', updatedSubmission);
    setSubmitting(false);
    setSubmitted(true);
  }

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  if (submitted) {
    return (
      <Alert severity="success" sx={{ my: 2 }}>
        Awaiting resubmission
      </Alert>
    );
  }

  return (
    <Formik initialValues={generateInitialValues(assignment.objectives)} onSubmit={handleSubmit}>
      {({ isSubmitting, values }) => (
        <Form sx={{ mt: 1 }}>
          {(error || validationError) && <Alert severity="error" sx={{ my: 2 }}>{error?.message || validationError}</Alert>}
          <Typography variant='h5' gutterBottom>Review Submission</Typography>

          <List>
            <FieldArray name="objectives">
              {() => (
                <>
                  {assignment.objectives.map((objective) => (
                    <ListItem key={objective.number} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ListItemText primary={objective.content} />
                      <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <SelectInput
                          name={`objectives[${objective.number}]`}
                          options={selectOptions}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Score' }}
                          required={true}
                          sx={{ backgroundColor: getBackgroundColor(values.objectives[objective.number]) }}
                        />
                      </FormControl>
                    </ListItem>
                  ))}
                </>
              )}
            </FieldArray>
          </List>
          <TextAreaInput name='note' label='Note to student (supports markdown)' rows={4} required={true} />
          <Button type='submit' variant='contained' fullWidth sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            Submit review
          </Button>
        </Form>
      )}
    </Formik>
  );
}
