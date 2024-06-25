import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useAssignmentTemplate } from 'hooks/useTeacherData';
import { AssignmentContent } from 'student/Assignment/AssignmentContent';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

export const Template = () => {
  const { trackId, courseSlug, templateId } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { template } = useAssignmentTemplate({ trackId, courseId: course.id, templateId });

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/tracks/${trackId}`, label: 'Track' },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}`, label: course.title },
      { path: `/teacher/tracks/${trackId}/courses/${courseSlug}/templates/${templateId}`, label: template.title }
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      <Typography variant='h6' gutterBottom>{course.title}</Typography>
      <AssignmentContent assignment={template} />
    </>
  );
}
