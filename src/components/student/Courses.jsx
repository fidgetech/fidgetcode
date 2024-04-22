// student courses list

import { useAuth } from 'contexts/AuthContext';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'shared/CoursesList';
import { Typography } from '@mui/material';

export const Courses = () => {
  const { currentUser: { trackId } } = useAuth();
  const { track } = useTrack({ trackId });

  return (
    <>
      <Typography variant='h4'>{track.title}</Typography>
      <CoursesList trackId={trackId} />
    </>
  );
};
