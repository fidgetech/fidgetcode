import { useParams } from 'react-router-dom';
import { useStudentData } from 'components//StudentDataContext';
import { useState, useEffect } from 'react';
import Loading from 'components/Layout/Loading';
import Markdown from 'react-markdown';

const Assignment = () => {
  const { assignmentId } = useParams();
  const { courses, assignments, fetchTrackAndCourses, fetchAssignments } = useStudentData();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    if (!courses) fetchTrackAndCourses();
  }, [courses, fetchTrackAndCourses]);

  useEffect(() => {
    if (courses && !assignments) fetchAssignments();
  }, [courses, assignments, fetchAssignments]);

  useEffect(() => {
    if (assignments) {
      const foundAssignment = assignments.find(assignment => assignment.id === assignmentId);
      setAssignment(foundAssignment);
    };
  }, [assignments, assignmentId]);

  if (!assignment) {
    return <Loading text='Loading assignment...'/>;
  }
  return (
    <>
      <h2>{assignment.template.title}</h2>
      <Markdown>{assignment.template.content}</Markdown>
    </>
  );
}

export default Assignment;
