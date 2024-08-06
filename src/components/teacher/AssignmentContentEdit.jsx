import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { List, ListItem, Typography, Box, Button } from '@mui/material';
import Loading from 'components/Layout/Loading';

export const AssignmentContentEdit = ({ assignment, student }) => {
  const { loading, error, updateData } = useFirestoreSubmit();
  const { title, content, objectives } = assignment;
  const sortedObjectives = objectives.sort((a, b) => a.number - b.number);

  const onSave = async (values, { setSubmitting }) => {
    console.log(values);
    const docPath = ['students', assignment.studentId, 'assignments', assignment.id];
    const updatedAssignment = {
      ...assignment,
      title: values.title,
      content: values.content,
      objectives: values.objectives
    };
    await updateData(docPath, updatedAssignment);
    console.log('Assignment updated', updatedAssignment);
    setSubmitting(false);
  }

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  if (error) {
    return <Typography color='error'>Error: {error.message}</Typography>
  }

  return (
    <>
      <Box my={4}>
        <Typography variant='h5'>Edit assignment for <em>{student.name}</em></Typography>
        <Typography color='error'>(edits will apply to this student only!)</Typography>
      </Box>

      <Formik
        initialValues={{ title, content, objectives: sortedObjectives }}
        onSubmit={onSave}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Field
              component={TextField}
              name="title"
              variant="outlined"
              fullWidth
              label="Title"
            />

            <Field
              component={TextField}
              name="content"
              variant="outlined"
              fullWidth
              multiline
              rows={30}
              label="Content"
              sx={{ my: 4 }}
            />

            <List>
              {values.objectives?.map((objective, index) => (
                <ListItem key={index} disablePadding>
                  <Field
                    component={TextField}
                    name={`objectives.${index}.content`}
                    variant="outlined"
                    fullWidth
                    label={`Objective ${objective.number}`}
                    sx={{ my: 1 }}
                  />
                </ListItem>
              ))}
            </List>

            <Button type="submit" variant="contained" color="warning" disabled={isSubmitting} sx={{ my: 4 }}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
