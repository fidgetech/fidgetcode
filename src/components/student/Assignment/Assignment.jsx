import { useEffect, useState } from 'react';
import { AssignmentContent } from './AssignmentContent';
import { AssignmentForm } from './AssignmentForm';
import { Divider, Alert, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAssignment } from 'hooks/useStudentData';
import { useAuth } from 'contexts/AuthContext';
import { AssignmentSubmissions } from 'teacher/AssignmentSubmissions';

const statusMapping = {
  'assigned': {
    showContent: true,
    showSubmissions: false,
    showForm: true,
    showAlert: false,
  },
  'submitted': {
    showContent: false,
    showSubmissions: false,
    showForm: false,
    showAlert: true,
    style: 'info',
    message: 'Your project has been submitted and is awaiting review.'
  },
  'pass': {
    showContent: false,
    showSubmissions: true,
    showForm: false,
    showAlert: true,
    style: 'success',
    message: 'Your project meets all expectations!'
  },
  'fail': {
    showContent: true,
    showSubmissions: true,
    showForm: true,
    showAlert: true,
    style: 'error',
    message: 'Your project requires resubmission. Please see comments below.'
  },
};

export const Assignment = () => {
  const { currentUser } = useAuth();
  const { assignmentId } = useParams();
  const { assignment } = useAssignment({ studentId: currentUser.uid, assignmentId });
  const [ assignmentStatus, setAssignmentStatus ] = useState(assignment.status);
  const [ statusConfig, setStatusConfig ] = useState(statusMapping[assignmentStatus]);

  useEffect(() => {
    setStatusConfig(statusMapping[assignmentStatus]);
  }, [assignmentStatus]);

  return (
    <>
      {statusConfig.showAlert &&
        <Alert severity={statusConfig.style} sx={{ my: 4 }}>
          {statusConfig.message}
        </Alert>
      }

      <AssignmentContent assignment={assignment} includeContent={statusConfig.showContent} />

      <Divider sx={{ my: 4 }} />

      {statusConfig.showSubmissions &&
        <AssignmentSubmissions assignment={assignment} />
      }

      {statusConfig.showForm &&
        <Box marginY={4}>
          <AssignmentForm assignment={assignment} setAssignmentStatus={setAssignmentStatus} />
        </Box>
      }
    </>
  );
}
