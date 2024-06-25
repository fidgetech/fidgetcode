// teacher courses list

import { useParams } from 'react-router-dom';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'shared/CoursesList';
import { StudentsList } from './StudentsList';
import { Typography, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

export const Track = () => {
  const { trackId } = useParams();
  const { track } = useTrack({ trackId });

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/teacher', label: 'Home' },
      { path: `/teacher/tracks/${trackId}`, label: 'Track' }
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      <Typography variant='h4'>{track.title}</Typography>
      <Typography variant='body1'>Syllabus: {track.syllabus}</Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6'>Courses in track</Typography>
      <CoursesList trackId={trackId} />

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6'>Students in track</Typography>
      <StudentsList trackId={trackId} />
    </>
  );
};
