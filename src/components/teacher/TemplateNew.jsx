import { v4 as uuidv4 } from 'uuid';
import slug from 'slug';
import { Button } from '@mui/material';
import { useDialog } from 'contexts/DialogContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useFirestoreSubmit } from 'hooks/useFirestoreSubmit';
import Loading from 'components/Layout/Loading';

const functions = getFunctions();
const githubFetch = httpsCallable(functions, 'githubFetchOnCall');

export const TemplateNew = ({ trackId, courseId }) => {
  const { loading, error, createData } = useFirestoreSubmit();

  const dialogOptions = {
    title: 'Create new template',
    message: `Please enter GitHub URL for the template source`,
    onConfirm: async ({ source, number }) => {
      try {
        const { data } = await githubFetch({ url: source });
        const { title, objectives, content } = data;

        const templateData = { source, number, title, objectives, content, courseId, courseSlug: courseId };
        const newTemplateId = `${slug(title)}-${uuidv4().split('-')[0]}`;
        const docPath = ['tracks', trackId, 'courses', courseId, 'assignmentTemplates'];

        await createData(docPath, templateData, newTemplateId);
        // setAlert({ severity: 'success', message: 'Template created!' });
        console.log('Template created!');
      } catch (error) {
        // setAlert({ severity: 'error', message: 'Invalid URL or file content!' });
        console.log('Invalid URL or file content!');
        return;
      }
    },
    inputFields: [
      { id: 'source', label: 'GitHub Source URL', type: 'text' },
      { id: 'number', label: 'Order', type: 'number' }
    ]
  };
  const { showDialog } = useDialog();
  const handleShowDialog = () => showDialog(dialogOptions);

  if (loading) {
    return <Loading text='Please wait...' />;
  }

  return (
    <>
      <p>{error && error.message}</p>
      <Button variant='contained' onClick={handleShowDialog} sx={{ mt: 2 }}>Create new template</Button>
    </>
  );
}
