import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useCourse, useStudentCourseAssignments } from 'hooks/useStudentData';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useEffect } from 'react';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';
import { getGradeColor } from 'utils/helpers';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

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
          <ListItem key={assignment.id} disablePadding sx={{ my: 1, backgroundColor: getGradeColor(theme, assignment.status) }}>
            <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/assignments/${assignment.id}`}>
              <ListItemText
                primary={assignment.title} primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                secondary={statusMapping[assignment.status]} secondaryTypographyProps={{ style: { fontWeight: 'bold' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  </>
  );
}
