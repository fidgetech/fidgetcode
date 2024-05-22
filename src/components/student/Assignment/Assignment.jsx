import { AssignmentContent } from './AssignmentContent';
import { AssignmentForm } from './AssignmentForm';
import { Divider, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAssignment } from 'hooks/useStudentData';
import { useAuth } from 'contexts/AuthContext';
import { AssignmentSubmissions } from 'teacher/AssignmentSubmissions';

export const Assignment = () => {
  const { currentUser } = useAuth();
  const { assignmentId } = useParams();
  const { assignment } = useAssignment({ studentId: currentUser.uid, assignmentId });

  return (
    <>
      <AssignmentContent assignment={assignment} includeContent={assignment.status === 'assigned'} />

      <Divider sx={{ my: 4 }} />

      {assignment.status === 'submitted' &&
        <Alert severity="success" sx={{ mt: 2 }}>
          Your project has been submitted and is awaiting review.
        </Alert>
      }

      {assignment.status === 'reviewed' &&
        <>
          <Alert severity="info" sx={{ mt: 2 }}>
            Your project has been reviewed and graded.
          </Alert>
          <AssignmentSubmissions assignment={assignment} />
        </>
      }

      {assignment.status === 'assigned' || assignment.status === 'reviewed' &&
        <AssignmentForm assignment={assignment} />
      }
    </>
  );
}
