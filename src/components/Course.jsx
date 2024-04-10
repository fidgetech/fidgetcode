import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useStudentData } from 'components//StudentDataContext';
import Loading from 'components/Layout/Loading';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const Course = () => {
  const { courseSlug } = useParams();
  const { courses, assignments, fetchTrackAndCourses, fetchAssignments } = useStudentData();
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    if (!courses) fetchTrackAndCourses();
  }, [courses, fetchTrackAndCourses]);

  useEffect(() => {
    if (courses && !assignments) fetchAssignments();
  }, [courses, assignments, fetchAssignments]);

  useEffect(() => {
    if (courses && courseSlug) {
      const foundCourse = courses.find(course => course.slug === courseSlug);
      setCourse(foundCourse);
    }
  }, [courses, courseSlug]);

  if (!course || !assignments) {
    return <Loading text='Loading course...'/>;
  }

  return (
    <>
      <h2>{course.title}</h2>
      <List>
        {assignments.filter(assignment => assignment.courseId === course.id).map(assignment => (
          <ListItem key={assignment.id} disablePadding>
            <ListItemButton component={RouterLink} to={`/student/courses/${course.slug}/assignments/${assignment.id}`}>
              <ListItemText primary={assignment.template.title} secondary={assignment.status} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Course;
