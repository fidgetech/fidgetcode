import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Divider } from '@mui/material';
import { useStudent } from 'hooks/useTeacherData';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'components/shared/CoursesList';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

export const Student = () => {
  const { studentId } = useParams();
  const { student } = useStudent({ studentId });
  const { trackId } = student;
  const { track } = useTrack({ trackId });

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/students/${studentId}`, label: student.name }
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      <h1>Student Overview Page</h1>
      <Typography variant='h4'>{student.name}</Typography>
      <Typography variant='body1'>{student.email}</Typography>
      <Typography variant='body1'>Track: {track.title} ({track.syllabus})</Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6' sx={{ mt: 2 }}>Select course to view {student.name} progress:</Typography>
      <CoursesList trackId={trackId} />
    </>
  );
};
