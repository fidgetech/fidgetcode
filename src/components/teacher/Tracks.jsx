import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useTracks } from 'hooks/useTeacherData';

export const Tracks = () => {
  const { tracks } = useTracks();

  return (
    <>
      <h2>Tracks</h2>
      <List>
        {tracks?.map((track) => (
          <ListItem key={track.id} disablePadding>
            <ListItemButton component={RouterLink} to={`tracks/${track.id}`}>
              <ListItemText primary={track.title} secondary={track.syllabus} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};
