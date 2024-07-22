import { useAuth } from 'contexts/AuthContext';
import Markdown from 'react-markdown';
import { Link, List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';

export const AssignmentContent = ({ assignment, includeContent=true }) => {
  const { isTeacher } = useAuth();
  const { title, content, objectives, source } = assignment;
  const sortedObjectives = objectives.sort((a, b) => a.number - b.number);

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
        {isTeacher ? <Link href={source}>{title}</Link> : title}
      </Typography>

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
