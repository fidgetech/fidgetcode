import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from 'hooks/useStudentData';
import { useStudent, useCourseAssignmentTemplatesWithAssignments, assignAssignmentToStudent } from 'hooks/useTeacherData';
import { AssignmentReview } from './AssignmentReview';
import { Button, Typography, Divider } from '@mui/material';
import { useDialog } from 'contexts/DialogContext';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';

const statusMapping = {
  submitted: 'Awaiting teacher review',
  assigned: 'Awaiting student submission',
};

export const AssignmentHandler = () => {
  const { trackId, courseSlug, studentId, assignmentId } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { student } = useStudent({ studentId });
  const { assignmentTemplatesWithAssignments } = useCourseAssignmentTemplatesWithAssignments({ studentId, trackId, courseId: course.id });

  const template = useMemo(() => assignmentTemplatesWithAssignments.find(t => t.id === assignmentId), [assignmentTemplatesWithAssignments, assignmentId]);
  const assignment = useMemo(() => template?.studentAssignment, [template]);

  const [assignmentStatus, setAssignmentStatus] = useState(assignment?.status);

  const confirmDialogOptions = {
    title: 'Confirm Assigning',
    message: `Assign ${template.title} to ${student.name}?`,
    onConfirm: async () => {
      console.log('assigning assignment', template.id, 'to student', studentId)
      await assignAssignmentToStudent({ studentId, trackId, courseId: course.id, templateId: template.id });
      setAssignmentStatus('assigned')
    }
  };
  const { showConfirm } = useDialog();
  const handleShowConfirm = () => showConfirm(confirmDialogOptions);

  useEffect(() => {
    if (assignment?.status) {
      setAssignmentStatus(assignment.status);
    }
  }, [assignment]);

  return (
    <>
      <Typography variant='h6' gutterBottom>
        {student.name} | {course.title} | {template.title}
      </Typography>
      <Typography variant='body1' gutterBottom sx={{ fontStyle: 'italic' }}>
        {statusMapping[assignmentStatus] || `Not yet assigned to ${student.name}`}
      </Typography>

      {!assignmentStatus &&
        <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleShowConfirm}>
          Assign to {student.name}
        </Button>
      }

      <Divider sx={{ my: 4 }} />

      <AssignmentContent assignment={template} />

      {assignmentStatus === 'submitted' &&
        <>
          <Divider sx={{ my: 4 }} />
          <AssignmentReview assignment={assignment} />
        </>
      }
    </>
  );
}
