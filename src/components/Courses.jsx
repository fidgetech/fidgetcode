import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useStudentData } from 'components/useStudentData';

const Courses = () => {
  const { track, courses } = useStudentData({ needTrack: true, needCourses: true });

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
