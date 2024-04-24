import Markdown from 'react-markdown';
import { useMemo } from 'react';
import { useAssignmentSubmissions } from 'hooks/useTeacherData';
import { Box, Divider, Typography, List, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatMarkdownForRender, localeOptions } from 'utils/helpers';

export const AssignmentSubmissions = ({ assignment }) => {
  const { studentId, id: assignmentId } = assignment;
  const { submissions } = useAssignmentSubmissions({ studentId, assignmentId });
  const latestSubmission = useMemo(() => submissions[submissions.length -1], [submissions]);
  const otherSubmissions = useMemo(() => submissions.slice(0, -1), [submissions]);

  return (
    <>
      <Typography variant='h5' gutterBottom>Latest Submission</Typography>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: { sm: 'flex' }, justifyContent: { sm: 'space-between' } }}>
            <Link href={latestSubmission.url} target="_blank" rel="noopener noreferrer">
              {latestSubmission.url.replaceAll('https://','').replaceAll('http://','')}
            </Link>
            <Typography color="text.secondary" gutterBottom>
              {latestSubmission.createdAt.toDate().toLocaleString('en-US', localeOptions)}
            </Typography>
          </Box>
          <Markdown>{formatMarkdownForRender(latestSubmission.note)}</Markdown>
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
                  <Markdown>{formatMarkdownForRender(submission.note)}</Markdown>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </>
      }
    </>
  );
}
