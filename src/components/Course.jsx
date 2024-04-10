import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentData } from 'components//StudentDataContext';
import Loading from 'components/Layout/Loading';

const Course = () => {
  const { slug } = useParams();
  const { courses, fetchTrackAndCourses } = useStudentData();
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    if (!courses) {
      fetchTrackAndCourses();
    }
  }, [courses, fetchTrackAndCourses]);

  useEffect(() => {
    if (courses && slug) {
      const foundCourse = courses.find(course => course.slug === slug);
      setCourse(foundCourse);
    }
  }, [courses, slug]);

  if (!course) {
    return <Loading text='Loading course...'/>;
  }

  return (
    <h2>{course.title}</h2>
  );
}

export default Course;
