import { useParams } from 'react-router-dom';
import { Typography, Divider } from '@mui/material';
import { useStudent } from 'hooks/useTeacherData';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'components/shared/CoursesList';

export const Student = () => {
const { studentId } = useParams();
const { student } = useStudent({ studentId });
const { trackId } = student;
const { track } = useTrack({ trackId });

  return (
    <>
      <h1>Student Overview Page</h1>
      <Typography variant='h4'>{student.name}</Typography>
      <Typography variant='body1'>{student.email}</Typography>
      <Typography variant='body1'>Track: {track.title} ({track.syllabus})</Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h6' sx={{ mt: 2 }}>Click course to view progress:</Typography>
      <CoursesList trackId={trackId} />
    </>
  );
};
