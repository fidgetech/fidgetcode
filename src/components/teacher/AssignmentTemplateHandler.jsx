import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Divider } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useStudent, useAssignmentTemplate, assignAssignmentToStudent } from 'hooks/useTeacherData';
import { useDialog } from 'contexts/DialogContext';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';

export const AssignmentTemplateHandler = () => {
  const navigate = useNavigate();
  const { courseSlug, studentId, templateId } = useParams();
  const { student } = useStudent({ studentId });
  const { trackId } = student;
  const { course } = useCourse({ trackId, courseSlug });
  const { template } = useAssignmentTemplate({ trackId, courseId: course.id, templateId });

  const confirmDialogOptions = {
    title: 'Confirm Assigning',
    message: `Assign ${template.title} to ${student.name}?`,
    onConfirm: async () => {
      console.log('assigning assignment', templateId, 'to student', studentId)
      await assignAssignmentToStudent({ studentId, trackId, courseId: course.id, templateId: templateId });
      navigate(`/teacher/students/${studentId}/courses/${courseSlug}`);
    }
  };
  const { showConfirm } = useDialog();
  const handleShowConfirm = () => showConfirm(confirmDialogOptions);

  return (
    <>
      <Typography variant='h6' gutterBottom>{course.title} | {template.title}</Typography>
      <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleShowConfirm}>
        Assign to {student.name}
      </Button>

      <Divider sx={{ my: 4 }} />

      <AssignmentContent assignment={template} />
    </>
  );
}
