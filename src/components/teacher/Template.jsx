import { useParams } from 'react-router-dom';
import { Typography, Divider } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useAssignmentTemplate } from 'hooks/useTeacherData';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';

export const Template = () => {
  const { trackId, courseSlug, templateId } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { template } = useAssignmentTemplate({ trackId, courseId: course.id, templateId });

  return (
    <>
      <Typography variant='h6' gutterBottom>{course.title}</Typography>
      <AssignmentContent assignment={template} />
    </>
  );
}
