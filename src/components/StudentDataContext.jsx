import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'components/Auth/AuthContext';
import { db } from 'src/firebase.js';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

const StudentDataContext = createContext({ track: null, courses: null, assigments: null, loading: null });

export const useStudentData = () => useContext(StudentDataContext);

export const StudentDataProvider = ({ children }) => {
  const [track, setTrack] = useState(null);
  const [courses, setCourses] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(track && courses ? false : true);
  const { trackId } = useAuth();

  const fetchTrackAndCourses = async () => {
    if (!trackId) return;
    setLoading(true);
    try {
      const trackRef = doc(db, 'tracks', trackId);
      const trackDoc = await getDoc(trackRef);
      if (!trackDoc.exists()) throw new Error('No track document found in db!');
      const trackData = trackDoc.data();

      const coursesRef = collection(db, 'tracks', trackId, 'courses');
      const q = query(coursesRef, orderBy('number'));
      const coursesSnapshot = await getDocs(q);
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setTrack(trackData);
      setCourses(coursesData);
      return { track: trackData, courses: coursesData };
    } catch (error) {
      console.error('Error fetching track and courses:', error);
    } finally {
      setLoading(false);
      console.log('Track and courses data loaded');
    }
  };

  const fetchAssignments = async (courseId) => {
    if (!assignments) {
    //   const assignmentsRef = collection(db, 'courses', courseId, 'assignments');
    //   // const loadedAssignments = await fetchAssignmentsFromApi(courseId);
    //   setAssignments(loadedAssignments);
    //   return loadedAssignments;
    }
    return assignments;
  };

  return (
    <StudentDataContext.Provider value={{ track, courses, assignments, loading, fetchTrackAndCourses, fetchAssignments }}>
      {children}
    </StudentDataContext.Provider>
  );
}
