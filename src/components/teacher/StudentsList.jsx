import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useTrackStudents } from 'hooks/useTeacherData';

export const StudentsList = ({ trackId }) => {
  const { students } = useTrackStudents({ trackId });

  return (
    <List>
      {students?.map((student) => (
        <ListItem key={student.id} disablePadding>
          <ListItemButton component={RouterLink} to={`students/${student.id}`}>
            <ListItemText primary={student.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
