import { Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useStudentWithAssignmentsAwaitingReview } from 'hooks/useTeacherData';
import { useTrack } from 'hooks/useStudentData';
import { CoursesList } from 'components/shared/CoursesList';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

export const Student = () => {
  const { studentId } = useParams();
  const { student } = useStudentWithAssignmentsAwaitingReview({ studentId });
  const { trackId } = student;
  const { track } = useTrack({ trackId });
  console.log('rendering component')

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

      <Typography variant='h6'>{student.assignments.length ? 'Assignments awaiting review:' : 'No assignments awaiting review'}</Typography>
        <List>
        {student.assignments?.map((assignment) => (
          <ListItem key={assignment.id} disablePadding>
            <ListItemButton component={RouterLink} to={`courses/${assignment.courseSlug}/assignments/${assignment.id}`}>
              <ListItemText
                primary={assignment.title}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


      <Divider sx={{ my: 4 }} />

      <Typography variant='h6' sx={{ mt: 2 }}>Select course to view {student.name} progress:</Typography>
      <CoursesList trackId={trackId} />
    </>
  );
};
