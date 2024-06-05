import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useCourse } from 'hooks/useStudentData';
import { useCourseAssignmentTemplates } from 'hooks/useTeacherData';

export const AssignmentTemplatesList = () => {
  const { trackId, courseSlug } = useParams();
  const { course } = useCourse({ trackId, courseSlug });
  const { assignmentTemplates } = useCourseAssignmentTemplates({ trackId, courseId: course.id });

  return (
    <List>
      {assignmentTemplates?.map((template) => (
        <ListItem key={template.id} disablePadding>
          <ListItemButton component={RouterLink} to={`templates/${template.id}`}>
            <ListItemText primary={`${template.number}. ${template.title}`} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
