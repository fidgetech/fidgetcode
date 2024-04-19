import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useTrack, useCourses } from 'hooks/useStudentData';
import { useAuth } from 'contexts/AuthContext';

const Courses = () => {
  const { currentUser: { trackId } } = useAuth();
  const { track } = useTrack({ trackId });
  const { courses } = useCourses({ trackId });

  return (
    <>
      <h2>{track.title}</h2>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}`}>
              <ListItemText primary={course.title} secondary={course.trackId} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Courses;
