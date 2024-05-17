import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import pluralize from 'pluralize';
import { useStudents, useTrackStudents, useStudentsWithAssignmentsAwaitingReview } from 'hooks/useTeacherData';

export const StudentsList = ({ trackId, withAssignments }) => {
  const { students } = withAssignments ? useStudentsWithAssignmentsAwaitingReview() : trackId ? useTrackStudents({ trackId }) : useStudents({ active: true });

  return (
    <List>
      {students?.map((student) => (
        <ListItem key={student.id} disablePadding>
          <ListItemButton component={RouterLink} to={`/teacher/students/${student.id}`}>
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
