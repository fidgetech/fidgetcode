// for teachers: student-course / course-student view (student progress in course)

import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCourse } from 'hooks/useStudentData';
import { useStudent, useCourseAssignmentTemplatesWithAssignments } from 'hooks/useTeacherData';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export const StudentCourse = () => {
  const { trackId, courseSlug, studentId } = useParams();
  const { student } = useStudent({ studentId });
  const { course } = useCourse({ trackId, courseSlug });
  const { assignmentTemplatesWithAssignments } = useCourseAssignmentTemplatesWithAssignments({ studentId, trackId, courseId: course.id });

  return (
    <>
      <h1>Student-Course Page (Progress)</h1>
      <Typography variant='h6'>{student.name} | {course.title}</Typography>

      <List>
        {assignmentTemplatesWithAssignments.map(template => (
          <ListItem key={template.id} disablePadding>
            <ListItemButton component={RouterLink} to={`assignments/${template.id}`}>
              <ListItemText primary={template.title} secondary={template.status} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}