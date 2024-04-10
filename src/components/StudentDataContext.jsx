import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'components/Auth/AuthContext';
import { db } from 'src/firebase.js';
import { documentId, collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

const StudentDataContext = createContext({ track: null, courses: null, assigments: null, loading: null });

export const useStudentData = () => useContext(StudentDataContext);

export const StudentDataProvider = ({ children }) => {
  const [track, setTrack] = useState(null);
  const [courses, setCourses] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(track && courses ? false : true);
  const { currentUser, trackId } = useAuth();

  const fetchTrackAndCourses = async () => {
    if (!trackId) return;
    if (track && courses) return;
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
      console.log('Track and courses data loaded');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching track and courses:', error);
    }
  };

  const fetchAssignments = async () => {
    if (!courses) return;
    if (assignments) return;
    console.log('Fetching assignments from Firestore...')
    setLoading(true);
    try {
      // get all assignments for the student
      const studentRef = doc(db, 'students', currentUser.uid);
      const assignmentsRef = collection(studentRef, 'assignments');
      const assignmentsQuery = query(assignmentsRef);
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignmentsData = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const assignmentIds = assignmentsData.map(assignment => assignment.id);

      const trackRef = doc(db, 'tracks', trackId);
      let assignmentTemplates = [];
      for (const course of courses) {
        // get all assignment templates for the course
        const courseRef = doc(trackRef, 'courses', course.id);
        const assignmentTemplatesRef = collection(courseRef, 'assignmentTemplates');
        const assignmentTemplatesQuery = query(assignmentTemplatesRef, where(documentId(), 'in', assignmentIds));
        const assignmentTemplatesSnapshot = await getDocs(assignmentTemplatesQuery);
        const assignmentTemplatesData = assignmentTemplatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        assignmentTemplates = [...assignmentTemplates, ...assignmentTemplatesData];
      }

      // merge assignments with templates
      const assignmentsWithTemplates = assignmentsData.map(assignment => {
        const template = assignmentTemplates.find(template => template.id === assignment.id);
        return { ...assignment, template };
      });

      setAssignments(assignmentsWithTemplates);
      console.log('Assignments data loaded', assignmentsWithTemplates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  return (
    <StudentDataContext.Provider value={{ track, courses, assignments, loading, fetchTrackAndCourses, fetchAssignments }}>
      {children}
    </StudentDataContext.Provider>
  );
}
