import Markdown from 'react-markdown';
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';

export const AssignmentContent = ({ assignment, includeContent=true }) => {
  const { title, content, objectives } = assignment;
  const sortedObjectives = objectives.sort((a, b) => a.number - b.number);

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{title}</Typography>

      {includeContent && <Markdown>{content}</Markdown>}

      <Divider sx={{ my: 4 }} />
      <Box border={1} padding={4}>
        <Typography variant='h5'>Objectives</Typography>
        <List>
          {sortedObjectives?.map(objective => (
            <ListItem key={objective.number} disablePadding>
              <ListItemText primary={objective.content} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
