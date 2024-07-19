// student courses list

import { useAuth } from 'contexts/AuthContext';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'shared/CoursesList';
import { Typography } from '@mui/material';

export const Courses = () => {
  const { currentUser: { trackId, uid } } = useAuth();
  const { track } = useTrack({ trackId });

  return (
    <>
      {/* <Typography variant='h4'>{track.title}</Typography> */}
      <Typography variant='h4'>Courses</Typography>
      <CoursesList trackId={trackId} studentId={uid} />
    </>
  );
};
