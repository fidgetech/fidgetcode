import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useStudents, useStudentAssignmentsAwaitingReview } from 'hooks/useTeacherData';
import { localeOptions } from 'utils/helpers';
import { StudentsList } from './StudentsList';
import { TracksList } from './TracksList';

export const TeacherHome = () => {
  // const { students } = useStudents({ active: true });
  // const studentsWithAssignments = [];
  // for (const student of students) {
  //   const { assignments } = useStudentAssignmentsAwaitingReview({ studentId: student.id });
  //   studentsWithAssignments.push({ ...student, assignments })
  // }

  return (
    <>
      <h2>Tracks</h2>
      <TracksList />

      <h2>Students</h2>
      <StudentsList />

      {/* <h3>OLD:</h3>
      <List>
        {studentsWithAssignments.map((student) => (
          <div key={student.id}>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={`students/${student.id}`}>
                <ListItemText primary={student.name} secondary={`${student.assignments.length} awaiting review`} />
              </ListItemButton>
            </ListItem>
            {!!student.assignments.length &&
              <List>
                {student.assignments.map((assignment) => (
                <ListItem key={assignment.id} sx={{ ml: 2 }}>
                  <ListItemText primary={assignment.title} secondary={assignment.createdAt.toDate().toLocaleString('en-US', localeOptions)} />
                </ListItem>
                ))}
              </List>
            }
          </div>
        ))}
      </List> */}
    </>
  );
};
