// teacher courses list

import { useParams } from 'react-router-dom';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'shared/CoursesList';
import { StudentsList } from './StudentsList';
import { Typography, Divider } from '@mui/material';

export const Track = () => {
  const { trackId } = useParams();
  const { track } = useTrack({ trackId });

  return (
    <>
      <h1>Track Overview Page</h1>
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
