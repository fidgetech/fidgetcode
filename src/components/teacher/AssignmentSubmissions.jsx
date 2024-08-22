import Markdown from 'react-markdown';
import { useMemo } from 'react';
import { useAssignmentSubmissions } from 'hooks/useTeacherData';
import { Box, Divider, Typography, List, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Link, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatMarkdownForRender, localeOptions, getGradeColor } from 'utils/helpers';
import { useTheme } from '@mui/material/styles';

const gradeMapping = {
  'none': 'Does not meet this standard yet',
  'some': 'Meets standard some of the time',
  'all': 'Meets standard all of the time',
}

export const AssignmentSubmissions = ({ assignment }) => {
  const { studentId, id: assignmentId } = assignment;
  const { submissions } = useAssignmentSubmissions({ studentId, assignmentId });
  const latestSubmission = useMemo(() => submissions[0], [submissions]);
  const otherSubmissions = useMemo(() => submissions.slice(1, submissions.length), [submissions]);

  if (!latestSubmission) return null;

  return (
    <>
      <Typography variant='h5' gutterBottom sx={{ my: 2 }}>Latest Submission</Typography>
      <Card variant="outlined">
        <CardContent>
          <Box marginY={1} sx={{ display: { sm: 'flex' }, justifyContent: { sm: 'space-between' } }}>
            <Link href={latestSubmission.url} target="_blank" rel="noopener noreferrer">
              {latestSubmission.url.replaceAll('https://','').replaceAll('http://','')}
            </Link>
            <Typography color="text.secondary" gutterBottom>
              {latestSubmission.createdAt?.toDate()?.toLocaleString('en-US', localeOptions)}
            </Typography>
          </Box>
          <SubmissionNotes assignment={assignment} submission={latestSubmission} />
        </CardContent>
      </Card>

      {otherSubmissions.length > 0 &&
        <>
          <Typography variant='h5' gutterBottom sx={{ mt: 4 }}>Previous Submissions</Typography>
          <List>
            {otherSubmissions.map(submission => (
              <Accordion key={submission.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} sx={{ mt: 2 }}>
                  <Typography color="text.secondary">
                    {submission.createdAt?.toDate()?.toLocaleString('en-US', localeOptions)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color='text.secondary'>{submission.url}</Typography>
                  <SubmissionNotes assignment={assignment} submission={submission} />
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </>
      }
    </>
  );
}

const SubmissionNotes = ({ assignment, submission }) => {
  const theme = useTheme();

  console.log('submission in SubmissionNotes', submission)
  const objectives = useMemo(() => {
    const assignmentObjectives = assignment.objectives;
    const submissionObjectives = submission.review?.objectives;
    return submission.review ? assignmentObjectives.map(objective => {
      const grade = submissionObjectives[objective.number];
      const gradeDisplay = gradeMapping[grade];
      return { number: objective.number, content: objective.content, grade: gradeDisplay };
    }) : [];
  }, [assignment.objectives, submission.objectives]);
  console.log('objectives in SubmissionNotes', objectives)

  return (
    <>
      <Box marginY={2}>
        <Markdown>{formatMarkdownForRender(submission.note)}</Markdown>
      </Box>
      {submission.review &&
        <>
          <Divider />
          <Box marginY={2}>
            <Box marginY={1} sx={{ display: { sm: 'flex' }, justifyContent: { sm: 'space-between' } }}>
              <Typography variant='body' gutterBottom sx={{ fontWeight: 'bold' }}>Reviewed by {submission.review.reviewedBy}</Typography>
              <Typography color="text.secondary" gutterBottom>
                {submission.review.reviewedAt?.toDate()?.toLocaleString('en-US', localeOptions)}
              </Typography>
            </Box>
          </Box>
          <Box marginY={2}>
            <Markdown>{formatMarkdownForRender(submission.review.note)}</Markdown>
          </Box>
          <Box marginY={2}>
            <List>
              {
                objectives.map(objective => (
                  <ListItem key={objective.number} sx={{ my: 1, backgroundColor: getGradeColor(theme, objective.grade) }}>
                    <ListItemText primary={objective.content} secondary={objective.grade} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
                  </ListItem>
                ))
              }
            </List>
          </Box>
        </>
      }
    </>
  );
}

