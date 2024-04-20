import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useCourse, useStudentCourseAssignments } from 'hooks/useStudentData';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const statusMapping = {
  assigned: 'Not yet submitted',
  submitted: 'Submitted',
};

const Course = () => {
  const { currentUser } = useAuth();
  const { trackId } = currentUser;
  const { courseSlug } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { assignments } = useStudentCourseAssignments({ studentId: currentUser.uid, courseId: course.id });

  return (
    <>
      <h2>{course.title}</h2>

      {assignments &&
        <List>
          {assignments.map(assignment => (
            <ListItem key={assignment.id} disablePadding>
              <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/assignments/${assignment.id}`}>
                <ListItemText primary={assignment.title} secondary={statusMapping[assignment.status]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      }
    </>
  );
}

export default Course;
