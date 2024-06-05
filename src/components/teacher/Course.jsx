// Course page for teachers

import { useParams } from 'react-router-dom';
import { Typography, Divider } from '@mui/material';
import { useTrack, useCourse } from 'hooks/useStudentData';
import { StudentsList } from './StudentsList';
import { AssignmentTemplatesList } from './AssignmentTemplatesList';

export const Course = () => {
  const { trackId, courseSlug } = useParams();
  const { track } = useTrack({ trackId });
  const { course } = useCourse({ trackId, courseSlug });

  return (
    <>
      <h1>Course Overview Page</h1>
      <Typography variant='h4'>{course.title}</Typography>
      <Typography variant='body1'>Track syllabus: {track.syllabus}</Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6' sx={{ mt: 2 }}>Select student to view progress in {course.title}:</Typography>
      <StudentsList trackId={trackId} courseId={course.id} />

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6' sx={{ mt: 2 }}>Independent Project templates:</Typography>
      <AssignmentTemplatesList />
    </>
  );
}
