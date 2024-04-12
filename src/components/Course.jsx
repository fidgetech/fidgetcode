import { useParams, Link as RouterLink } from 'react-router-dom';
import { useStudentData } from 'hooks/useStudentData';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const Course = () => {
  const { courseSlug } = useParams();
  const { courses, assignments } = useStudentData({ needCourses: true, needAssignments: true });
  const course = courses.find(course => course.slug === courseSlug);
  const currentCourseAssignments = assignments[course.id];
  return (
    <>
      <h2>{course.title}</h2>

      {currentCourseAssignments &&
        <List>
          {assignments[course.id].map(assignment => (
            <ListItem key={assignment.id} disablePadding>
              <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/assignments/${assignment.id}`}>
                <ListItemText primary={assignment.template.title} secondary={assignment.status} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      }
    </>
  );
}

export default Course;
