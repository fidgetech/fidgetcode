import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useCourses } from 'hooks/useStudentData';

export const CoursesList = ({ trackId }) => {
  const { courses } = useCourses({ trackId });

  return (
    <List>
      {courses?.map((course) => (
        <ListItem key={course.id} disablePadding>
          <ListItemButton component={RouterLink} to={`courses/${course.slug}`}>
            <ListItemText primary={course.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
