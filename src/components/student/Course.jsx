import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useCourse, useStudentCourseAssignments } from 'hooks/useStudentData';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useEffect } from 'react';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

const statusMapping = {
  assigned: 'Not yet submitted',
  submitted: 'Submitted',
  fail: 'Requires resubmission',
  pass: 'Meets expectations',
};

export const Course = () => {
  const { currentUser } = useAuth();
  const { trackId } = currentUser;
  const { courseSlug } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { assignments } = useStudentCourseAssignments({ studentId: currentUser.uid, courseId: course.id });

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { path: '/student', label: 'Home' },
      { path: `/student/courses/${courseSlug}`, label: course.title },
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      <h2>{course.title}</h2>

      <List>
        {assignments?.map(assignment => (
          <ListItem key={assignment.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/assignments/${assignment.id}`}>
              <ListItemText primary={assignment.title} secondary={statusMapping[assignment.status]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  </>
  );
}
