import { useAuth } from 'contexts/AuthContext';
import { db } from 'services/firebase.js';
import { useQuery } from '@tanstack/react-query';
import { documentId, collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { fetchDocumentsInChunks } from 'utils/helpers';

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
  const assignmentsQuery = query(assignmentsRef, orderBy('courseId'));
  const assignmentsSnapshot = await getDocs(assignmentsQuery);
  const assignmentsData = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const assignmentIds = assignmentsData.map(assignment => assignment.id);

  let assignmentsByCourse = assignmentsData.reduce((acc, assignment) => {
    acc[assignment.courseId] = acc[assignment.courseId] || [];
    acc[assignment.courseId].push({ ...assignment, template: null });
    return acc;
  }, {});

  console.log('fetching assignment templates...');
  // get assignment templates for each course
  for (const course of courses) {
    if (!assignmentsByCourse[course.id]) continue;
    const courseRef = doc(db, 'tracks', trackId, 'courses', course.id);
    const assignmentTemplatesRef = collection(courseRef, 'assignmentTemplates');
    const assignmentTemplatesQuery = query(assignmentTemplatesRef, orderBy('number'));
    const templatesData = await fetchDocumentsInChunks(assignmentTemplatesQuery, documentId(), assignmentIds);
    for (const template of templatesData) {
      const assignment = assignmentsByCourse[course.id].find(a => a.id === template.id);
      if (assignment) assignment.template = template;
    }
    assignmentsByCourse[course.id].sort((a, b) => a.template.number - b.template.number);
  }

  console.log('done fetching assignments and assignment templates');
  return assignmentsByCourse;
}

export const useStudentData = (needs = {}) => {
  const { currentUser, trackId } = useAuth();

  const track = needs.needTrack ? useQuery({
    queryKey: ['track', trackId],
    queryFn: () => fetchTrack(trackId),
    enabled: !!trackId
  }).data : null;

  const courses = needs.needCourses || needs.needAssignments ? useQuery({
    queryKey: ['courses', trackId],
    queryFn: () => fetchCourses(trackId),
    enabled: !!trackId && !!track
  }).data : null;

  const assignments = needs.needAssignments ? useQuery({
    queryKey: ['assignments', currentUser?.uid, trackId],
    queryFn: () => fetchAssignments(currentUser, trackId, courses),
    enabled: !!currentUser && !!trackId && !!courses
  }).data : null;

  return { track, courses, assignments };
};
