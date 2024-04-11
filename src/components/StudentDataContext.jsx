import { createContext, useContext } from 'react';
import { useAuth } from 'components/Auth/AuthContext';
import { db } from 'src/firebase.js';
import { useQuery } from '@tanstack/react-query';
import { documentId, collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

const fetchTrack = async (trackId) => {
  console.log('fetching track...');
  const trackRef = doc(db, 'tracks', trackId);
  const trackSnapshot = await getDoc(trackRef);
  if (!trackSnapshot.exists()) throw new Error('Track not found');
  console.log('done fetching track');
  return { id: trackSnapshot.id, ...trackSnapshot.data() };
}

const fetchCourses = async (trackId) => {
  console.log('fetching courses...');
  if (!trackId) throw new Error('Track ID is required to fetch courses');
  const coursesRef = collection(db, 'tracks', trackId, 'courses');
  const coursesQuery = query(coursesRef, orderBy('number'));
  const coursesSnapshot = await getDocs(coursesQuery);
  if (coursesSnapshot.empty) throw new Error('No courses found for the given track');
  console.log('done fetching courses');
  return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchAssignments = async (currentUser, trackId, courses) => {
  if (!currentUser || !trackId || !courses.length) throw new Error('Missing parameters to fetch assignments');

  console.log('fetching assignments...');
  // get all assignments for the student
  const studentRef = doc(db, 'students', currentUser.uid);
  const assignmentsRef = collection(studentRef, 'assignments');
  const assignmentsSnapshot = await getDocs(assignmentsRef);
  const assignmentsData = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const assignmentIds = assignmentsData.map(assignment => assignment.id);

  console.log('fetching assignment templates...');
  // get assignment templates for each course
  let assignmentTemplates = [];
  for (const course of courses) {
    const courseRef = doc(db, 'tracks', trackId, 'courses', course.id);
    const assignmentTemplatesRef = collection(courseRef, 'assignmentTemplates');
    const assignmentTemplatesQuery = query(assignmentTemplatesRef, where(documentId(), 'in', assignmentIds));
    const assignmentTemplatesSnapshot = await getDocs(assignmentTemplatesQuery);
    const templatesData = assignmentTemplatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    assignmentTemplates = [...assignmentTemplates, ...templatesData];
  }

  // merge assignments with templates
  const assignmentsWithTemplates = assignmentsData.map(assignment => {
    const template = assignmentTemplates.find(template => template.id === assignment.id);
    return { ...assignment, template };
  });

  console.log('done fetching assignments and assignment templates');
  return assignmentsWithTemplates;
}

const StudentDataContext = createContext();

export const useStudentData = (needs = {}) => {
  const context = useContext(StudentDataContext);
  const { currentUser, trackId } = useAuth();

  const track = needs.needTrack ? useQuery({
    queryKey: ['track', trackId],
    queryFn: () => context.fetchTrack(trackId),
    enabled: !!trackId
  }).data : null;

  const courses = needs.needCourses || needs.needAssignments ? useQuery({
    queryKey: ['courses', trackId],
    queryFn: () => context.fetchCourses(trackId),
    enabled: !!trackId && !!track
  }).data : null;

  const assignments = needs.needAssignments ? useQuery({
    queryKey: ['assignments', currentUser?.uid, trackId],
    queryFn: () => context.fetchAssignments(currentUser, trackId, courses),
    enabled: !!currentUser && !!trackId && !!courses
  }).data : null;

  return { track, courses, assignments };
};

export const StudentDataProvider = ({ children }) => {
  return (
    <StudentDataContext.Provider value={{ fetchTrack, fetchCourses, fetchAssignments }}>
      {children}
    </StudentDataContext.Provider>
  );
}
