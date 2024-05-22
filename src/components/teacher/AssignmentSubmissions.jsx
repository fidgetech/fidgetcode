import Markdown from 'react-markdown';
import { useMemo } from 'react';
import { useAssignmentSubmissions } from 'hooks/useTeacherData';
import { Box, Divider, Typography, List, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Link, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatMarkdownForRender, localeOptions } from 'utils/helpers';

export const AssignmentSubmissions = ({ assignment }) => {
  const { studentId, id: assignmentId } = assignment;
  const { submissions } = useAssignmentSubmissions({ studentId, assignmentId });
  const latestSubmission = useMemo(() => submissions[submissions.length -1], [submissions]);
  const otherSubmissions = useMemo(() => submissions.slice(0, -1), [submissions]);

  console.log('submissions:', submissions)
  return (
    <>
      <Typography variant='h5' gutterBottom>Latest Submission</Typography>
      <Card variant="outlined">
        <CardContent>
          <Box marginY={1} sx={{ display: { sm: 'flex' }, justifyContent: { sm: 'space-between' } }}>
            <Link href={latestSubmission.url} target="_blank" rel="noopener noreferrer">
              {latestSubmission.url.replaceAll('https://','').replaceAll('http://','')}
            </Link>
            <Typography color="text.secondary" gutterBottom>
              {latestSubmission.createdAt.toDate().toLocaleString('en-US', localeOptions)}
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
                <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary">
                    {submission.createdAt.toDate().toLocaleString('en-US', localeOptions)}
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
  const objectives = useMemo(() => {
    const assignmentObjectives = assignment.objectives;
    const submissionObjectives = submission.review.objectives;
    return assignmentObjectives.map(objective => {
      const grade = submissionObjectives[objective.number];
      return { number: objective.number, content: objective.content, grade };
    });
  }, [assignment.objectives, submission.objectives]);

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
              <Typography variant='body' gutterBottom sx={{ fontWeight: 'bold' }}>Teacher Review</Typography>
              <Typography color="text.secondary" gutterBottom>
                {submission.review.reviewedAt.toDate().toLocaleString('en-US', localeOptions)}
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
                  <ListItem key={objective.number}>
                    <ListItemText primary={objective.content} secondary={objective.grade} />
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

