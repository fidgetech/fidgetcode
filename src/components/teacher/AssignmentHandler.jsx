import { useParams } from 'react-router-dom';
import { useCourse } from 'hooks/useStudentData';
import { useStudent, assignAssignmentToStudent } from 'hooks/useTeacherData';
import { useAssignment } from 'hooks/useStudentData';
import { AssignmentSubmissions } from './AssignmentSubmissions';
import { AssignmentReview } from './AssignmentReview';
import { Button, Typography, Divider } from '@mui/material';
import { useDialog } from 'contexts/DialogContext';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';

const statusMapping = {
  submitted: 'Awaiting teacher review',
  assigned: 'Awaiting student submission',
  reviewed: 'Reviewed',
};

export const AssignmentHandler = () => {
  const { courseSlug, studentId, assignmentId } = useParams();
  const { student } = useStudent({ studentId });
  const { trackId } = student;
  const { course } = useCourse({ trackId, courseSlug });
  const { assignment } = useAssignment({ studentId, assignmentId });

  const confirmDialogOptions = {
    title: 'Confirm Assigning',
    message: `Assign ${assignment.title} to ${student.name}?`,
    onConfirm: async () => {
      console.log('assigning assignment', assignment.templateId, 'to student', studentId)
      await assignAssignmentToStudent({ studentId, trackId, courseId: course.id, templateId: assignment.templateId });
    }
  };
  const { showConfirm } = useDialog();
  const handleShowConfirm = () => showConfirm(confirmDialogOptions);

  return (
    <>
      <Typography variant='h6' gutterBottom>
        {student.name} | {course.title} | {assignment.title}
      </Typography>
      <Typography variant='body1' gutterBottom sx={{ fontStyle: 'italic' }}>
        {statusMapping[assignment.status] || `Not yet assigned to ${student.name}`}
      </Typography>

      {!assignment.status &&
        <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleShowConfirm}>
          Assign to {student.name}
        </Button>
      }

      <Divider sx={{ my: 4 }} />

      <AssignmentContent assignment={assignment} />

      {assignment.status &&
        <>
          <Divider sx={{ my: 4 }} />
          <AssignmentSubmissions assignment={assignment} />
          {assignment.status === 'submitted' &&
            <>
              <Divider sx={{ my: 4 }} />
              <AssignmentReview assignment={assignment} />
            </>
          }
        </>
      }
    </>
  );
}
