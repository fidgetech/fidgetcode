import { useParams } from 'react-router-dom';
import { useStudentData } from 'components/useStudentData';
import Markdown from 'react-markdown';

const Assignment = () => {
  const { assignmentId } = useParams();
  const { assignments } = useStudentData({ needAssignments: true });
  const assignment = assignments.find(assignment => assignment.id === assignmentId);
  const template = assignment.template;

  return (
    <>
      <h2>{template.title}</h2>
      <Markdown>{template.content}</Markdown>
    </>
  );
}

export default Assignment;
