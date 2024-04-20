import Markdown from 'react-markdown';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

export const AssignmentContent = ({ assignment }) => {
  const { title, content, objectives } = assignment;
  const sortedObjectives = objectives.sort((a, b) => a.number - b.number);

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{title}</Typography>

      <Markdown>{content}</Markdown>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h5'>Objectives</Typography>
      <List>
        {sortedObjectives.map(objective => (
          <ListItem key={objective.number} disablePadding>
            <ListItemText primary={objective.content} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
