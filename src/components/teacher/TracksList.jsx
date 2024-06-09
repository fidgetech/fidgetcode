import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import pluralize from 'pluralize';
import { useTracksWithStudents } from 'hooks/useTeacherData';

export const TracksList = () => {
  const { tracks } = useTracksWithStudents();
  const tracksWithStudents = useMemo(() => tracks.filter(track => track.students.length), [tracks]);

  return (
    <List>
      {tracksWithStudents?.map((track) => (
        <ListItem key={track.id} disablePadding>
          <ListItemButton component={RouterLink} to={`tracks/${track.id}`}>
            <ListItemText
              primary={`${track.title} - ${track.syllabus}`}
              secondary={`${track.students.length} ${pluralize('student', track.students.length)}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
