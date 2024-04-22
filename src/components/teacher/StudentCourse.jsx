// for teachers: student-course / course-student view (student progress in course)

import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCourse, useStudentCourseAssignments } from 'hooks/useStudentData';
import { useStudent, useCourseAssignmentTemplates } from 'hooks/useTeacherData';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export const StudentCourse = () => {
  const { trackId, courseSlug, studentId } = useParams();
  const { student } = useStudent({ studentId });
  const { course } = useCourse({ trackId, courseSlug });
  const { assignments } = useStudentCourseAssignments({ studentId, courseId: course.id });
  const { assignmentTemplates } = useCourseAssignmentTemplates({ trackId, courseId: course.id });
  const assignmentTemplatesWithAssignments = assignmentTemplates.map(template => {
    const studentAssignment = assignments.find(assignment => assignment.templateId === template.id);
    let status;
    if (!studentAssignment) {
      status = 'Not assigned';
    } else if (studentAssignment.status === 'submitted') {
      status = 'Awaiting teacher review';
    } else if (studentAssignment.status === 'assigned') {
      status = 'Awaiting student submission';
    } else {
      status = 'Unexpected status';
    }
    return { ...template, status, studentAssignment };
  });

  console.log(assignmentTemplatesWithAssignments)
  return (
    <>
      <h1>Student-Course Page (Progress)</h1>
      <Typography variant='h6'>
        {student.name} | {course.title}
      </Typography>

      <List>
        {assignmentTemplatesWithAssignments.map(template => (
          <ListItem key={template.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/templates/${template.id}`}>
              <ListItemText primary={template.title} secondary={template.status} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
