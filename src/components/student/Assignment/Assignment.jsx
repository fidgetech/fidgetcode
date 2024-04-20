import { AssignmentContent } from './AssignmentContent';
import { AssignmentForm } from './AssignmentForm';
import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAssignment } from 'hooks/useStudentData';
import { useAuth } from 'contexts/AuthContext';

export const Assignment = () => {
  const { currentUser } = useAuth();
  const { assignmentId } = useParams();
  const { assignment } = useAssignment({ studentId: currentUser.uid, assignmentId });

  return (
    <>
      <AssignmentContent assignment={assignment} />
      <Divider sx={{ my: 4 }} />
      <AssignmentForm assignment={assignment} />
    </>
  );
}
