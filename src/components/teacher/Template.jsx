import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Link, Box, TextField, Alert } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useAssignmentTemplate } from 'hooks/useTeacherData';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';
import { useDialog } from 'contexts/DialogContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';

const functions = getFunctions();
const validateUrl = httpsCallable(functions, 'githubValidateUrl');

export const Template = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const { updateData } = useFirestoreSubmit();
  const { trackId, courseSlug, templateId } = useParams();
  const { course } = useCourse({ trackId, courseSlug });

  const { template } = useAssignmentTemplate({ trackId, courseId: course.id, templateId });
  const [newSourceUrl, setNewSourceUrl] = useState(template.source);

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/tracks/${trackId}`, label: 'Track' },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}`, label: course.title },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}/templates/${templateId}`, label: template.title }
    ]);
  }, [setBreadcrumbs]);

  const confirmDialogOptions = {
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
  const { showConfirm } = useDialog();
  const handleShowConfirm = () => showConfirm(confirmDialogOptions);

  const handleEditSource = () => {
    setAlert(null);
    setNewSourceUrl(template.source);
    setIsEditing(true);
  }

  return (
    <>
      {alert && <Alert severity={alert.severity} sx={{ my: 1 }}>{alert.message}</Alert>}

      <Typography variant='h6' gutterBottom>{course.title}</Typography>

      <Typography variant='h6'>Independent Project Template</Typography>

      <Box sx={{ my: 2 }}>
        {isEditing ?
          <>
            <TextField
              label="GitHub Source URL"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              fullWidth
            />
            <Button color='error' onClick={handleShowConfirm} disabled={newSourceUrl === template.source}>Update source URL</Button>
          </>
        :
          <>
            <Button color='info'><Link href={template.source}>view linked file</Link></Button>
            <Button color='warning' onClick={handleEditSource}>change source url</Button>
          </>
        }
      </Box>

      <AssignmentContent assignment={template} />
    </>
  );
}
