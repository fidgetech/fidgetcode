import { List, ListItem, ListItemText } from '@mui/material';
import { useStudentData } from './StudentDataContext';
import Loading from 'components/Layout/Loading';

const CoursesList = () => {
  const { studentData, loading } = useStudentData();

  if (loading) return <Loading text='Loading student data...' />;
  if (!studentData) return <div>Error loading student data :(</div>;

  const { track, courses } = studentData;
  return (
    <>
      <h2>{track.title}</h2>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id}>
            <ListItemText primary={course.title} secondary={course.trackId} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CoursesList;
