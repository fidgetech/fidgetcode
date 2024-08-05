import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Typography, Button, Link, Box, TextField, Alert, Stack } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useAssignmentTemplate } from 'hooks/useTeacherData';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';
import { useDialog } from 'contexts/DialogContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';

const functions = getFunctions();
const validateUrl = httpsCallable(functions, 'githubFetchOnCall');

export const Template = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const { updateData, deleteData } = useFirestoreSubmit();
  const { trackId, courseSlug, templateId } = useParams();
  const { course } = useCourse({ trackId, courseSlug });

  const { template } = useAssignmentTemplate({ trackId, courseId: course.id, templateId });
  const [newSourceUrl, setNewSourceUrl] = useState(template.source);
  const [newNumber, setNewNumber] = useState(template.number);
  const [deleting, setDeleting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/tracks/${trackId}`, label: 'Track' },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}`, label: course.title },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}/templates/${templateId}`, label: template.title }
    ]);
  }, [setBreadcrumbs]);

  const sourceDialogOptions = {
    title: 'Really change template source?',
    message: `This will overwrite existing title, content and objectives!`,
    onConfirm: async () => {
      console.log('changing source URL to', newSourceUrl);

      try {
        await validateUrl({ url: newSourceUrl });
      } catch (error) {
        setAlert({ severity: 'error', message: 'Invalid URL or file content!' });
        return;
      }

      console.log('source URL is valid');
      setIsEditing(false);
      const docPath = ['tracks', trackId, 'courses', course.id, 'assignmentTemplates', template.id];
      const updatedTemplate = { ...template, source: newSourceUrl, content: 'Refreshing content...' };
      await updateData(docPath, updatedTemplate);
      setAlert({ severity: 'success', message: 'Source updated!' });
    }
  };

  const deleteDialogOptions = {
    title: 'Really delete this template?',
    message: `This cannot be undone!`,
    onConfirm: async () => {
      console.log('deleting template');
      setDeleting(true);
      const docPath = ['tracks', trackId, 'courses', course.id, 'assignmentTemplates', template.id];
      await deleteData(docPath);
      setRedirecting(true);
    }
  };

  const { showDialog } = useDialog();
  const handleShowSourceDialog = () => showDialog(sourceDialogOptions);
  const handleShowDeleteDialog = () => showDialog(deleteDialogOptions);

  const handleEditSource = () => {
    setAlert(null);
    setNewSourceUrl(template.source);
    setIsEditing(true);
  }

  const handleUpdateNumber = async () => {
    console.log('updating order to', newNumber);
    setIsEditing(false);
    const docPath = ['tracks', trackId, 'courses', course.id, 'assignmentTemplates', template.id];
    const updatedTemplate = { ...template, number: parseFloat(newNumber) };
    await updateData(docPath, updatedTemplate);
    setAlert({ severity: 'success', message: 'Order updated!' });
  }

  if (redirecting) {
    return <Navigate to={`/teacher/tracks/${trackId}/courses/${courseSlug}`} />;
  }

  return (
    <>
      {alert && <Alert severity={alert.severity} sx={{ my: 1 }}>{alert.message}</Alert>}

      <Typography variant='h6' gutterBottom>{course.title}</Typography>

      <Typography variant='h6'>Independent Project Template</Typography>

      <Box sx={{ mb: 2 }}>
        {isEditing ?
          <>
            <Box sx={{ my: 4 }}>
              <TextField
                label="GitHub Source URL"
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
                fullWidth
              />
              <Button color='warning' onClick={handleShowSourceDialog} disabled={newSourceUrl === template.source}>Update source URL</Button>
            </Box>
            <Box sx={{ my: 4 }}>
              <TextField
                label="Order"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                fullWidth
              />
              <Button color='warning' onClick={handleUpdateNumber} disabled={newNumber === template.number}>Update order</Button>
            </Box>
          </>
        :
          <Stack direction="row" spacing={3}>
            <Button color='info'><Link href={template.source} sx={{ textDecoration: 'none' }}>View linked file</Link></Button>
            <Button color='warning' onClick={handleEditSource}>Edit</Button>
            <Button color='error' onClick={handleShowDeleteDialog}>Delete</Button>
          </Stack>
        }
      </Box>

      {!deleting && <AssignmentContent assignment={template} />}
    </>
  );
}
