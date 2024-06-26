import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from 'hooks/useStudentData';
import { useStudent } from 'hooks/useTeacherData';
import { useAssignment } from 'hooks/useStudentData';
import { AssignmentSubmissions } from './AssignmentSubmissions';
import { AssignmentReview } from './AssignmentReview';
import { Typography, Divider, Alert, Button } from '@mui/material';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

const statusMapping = {
  assigned: { style: 'info', message: 'Awaiting student submission' },
  submitted: { style: 'info', message: 'Awaiting teacher review' },
  fail: { style: 'info', message: 'Awaiting resubmission' },
  pass: { style: 'success', message: 'Meets expectations' },
};

export const AssignmentHandler = () => {
  console.log('rendering AssignmentHandler')
  const { courseSlug, studentId, assignmentId } = useParams();
  const { student } = useStudent({ studentId });
  const { trackId } = student;
  const { course } = useCourse({ trackId, courseSlug });
  const { assignment } = useAssignment({ studentId, assignmentId });
  const [ assignmentStatus, setAssignmentStatus ] = useState(assignment.status);
  const [ statusConfig, setStatusConfig ] = useState(statusMapping[assignmentStatus]);

  useEffect(() => {
    setStatusConfig(statusMapping[assignmentStatus]);
  }, [assignmentStatus]);

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/tracks/${trackId}`, label: 'Track' },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}`, label: course.title },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}/students/${studentId}`, label: student.name },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}/students/${studentId}/assignments/${assignmentId}`, label: assignment.title }
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      <Typography variant='h6' gutterBottom>
        {student.name} | {course.title} | {assignment.title}
      </Typography>
      <Alert severity={statusConfig.style} sx={{ my: 4 }}>
        {statusConfig.message || `Not yet assigned to ${student.name}`}
      </Alert>

      <Divider sx={{ my: 4 }} />

      <AssignmentContent assignment={assignment} />

      {assignmentStatus &&
        <>
          <Divider sx={{ my: 4 }} />
          <AssignmentSubmissions assignment={assignment} />
          {assignmentStatus === 'submitted' &&
            <>
              <Divider sx={{ my: 4 }} />
              <AssignmentReview assignment={assignment} setAssignmentStatus={setAssignmentStatus} />
            </>
          }
          {(assignmentStatus === 'fail' || assignmentStatus === 'pass') &&
            <Button variant='contained' color='error' sx={{ my: 2}} onClick={() => setAssignmentStatus('submitted')}>
              Redo review
            </Button>
          }
        </>
      }
    </>
  );
}
