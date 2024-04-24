import Markdown from 'react-markdown';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

export const AssignmentContent = ({ assignment, includeContent=true }) => {
  const { title, content, objectives } = assignment;
  const sortedObjectives = objectives.sort((a, b) => a.number - b.number);

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{title}</Typography>

      {includeContent && <Markdown>{content}</Markdown>}

      <Typography variant='h5' sx={{ mt: 4 }}>Objectives</Typography>
      <List>
        {sortedObjectives?.map(objective => (
          <ListItem key={objective.number} disablePadding>
            <ListItemText primary={objective.content} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
