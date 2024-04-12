import { useParams } from 'react-router-dom';
import { useStudentData } from 'hooks/useStudentData';
import Markdown from 'react-markdown';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

const Assignment = () => {
  const { courseSlug, assignmentId } = useParams();
  const { courses, assignments } = useStudentData({ needAssignments: true });
  const course = courses.find(course => course.slug === courseSlug);
  const assignment = assignments[course.id].find(assignment => assignment.id === assignmentId);
  const { title, content, objectives } = assignment.template;
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

export default Assignment;
