import { useState } from 'react';
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
  const [ formSubmitted, setFormSubmitted ] = useState(false);

  return (
    <>
      <AssignmentContent
        assignment={assignment}
        includeContent={!formSubmitted && assignment.status === 'assigned'} 
        formSubmitted={formSubmitted} setFormSubmitted={setFormSubmitted}  
      />

      <Divider sx={{ my: 4 }} />

      <AssignmentForm
        assignment={assignment}
        formSubmitted={formSubmitted} setFormSubmitted={setFormSubmitted}
      />
    </>
  );
}
