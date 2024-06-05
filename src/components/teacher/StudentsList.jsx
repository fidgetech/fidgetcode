import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import pluralize from 'pluralize';
import { useStudents, useTrackStudents, useStudentsWithAssignmentsAwaitingReview } from 'hooks/useTeacherData';

export const StudentsList = ({ trackId, courseId }) => {
  const { students } = trackId ? useTrackStudents({ trackId }) : useStudents({ active: true });
  const { students: studentsWithAssignments } = useStudentsWithAssignmentsAwaitingReview({ students, courseId });

  return (
    <List>
      {studentsWithAssignments?.map((student) => (
        <ListItem key={student.id} disablePadding>
          <ListItemButton component={RouterLink} to={courseId ? `students/${student.id}` : `/teacher/students/${student.id}`}>
            <ListItemText
              primary={student.name}
              secondary={student.assignments ? `${student.assignments.length} ${pluralize('assignment', student.assignments.length)} awaiting review` : ''}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
