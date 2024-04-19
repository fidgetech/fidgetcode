import { db } from 'services/firebase.js';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

const fetchTrack = async (trackId) => {
  if (!trackId) throw new Error('Track ID is required to fetch track');
  console.log(`fetching track ${trackId}`);
  const trackRef = doc(db, 'tracks', trackId);
  const trackSnapshot = await getDoc(trackRef);
  if (!trackSnapshot.exists()) throw new Error('Track not found');
  return { id: trackSnapshot.id, ...trackSnapshot.data() };
}

const fetchCourses = async (trackId) => {
  if (!trackId) throw new Error('Track ID is required to fetch courses');
  console.log(`fetching courses for track ${trackId}`);
  const coursesRef = collection(db, 'tracks', trackId, 'courses');
  const coursesQuery = query(coursesRef, orderBy('number'));
  const coursesSnapshot = await getDocs(coursesQuery);
  if (coursesSnapshot.empty) throw new Error('No courses found for the given track');
  return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchCourse = async (trackId, courseId) => {
  if (!trackId || !courseId) throw new Error('Missing parameters to fetch course');
  console.log(`fetching course ${courseId}`);
  const courseRef = doc(db, 'tracks', trackId, 'courses', courseId);
  const courseSnapshot = await getDoc(courseRef);
  if (!courseSnapshot.exists()) throw new Error('Course not found');
  return { id: courseSnapshot.id, ...courseSnapshot.data() };
}

const fetchStudentCourseAssignments = async (studentId, courseId) => {
  if (!studentId || !courseId) throw new Error('Missing parameters to fetch student course assignments');
  console.log(`fetching assignments for student ${studentId}, course ${courseId}`);
  const studentRef = doc(db, 'students', studentId);
  const assignmentsRef = collection(studentRef, 'assignments');
  const assignmentsQuery = query(assignmentsRef, where('courseId', '==', courseId));
  const assignmentsSnapshot = await getDocs(assignmentsQuery);
  if (assignmentsSnapshot.empty) {
    console.log('no assignments found for the student for this course');
    return [];
  }
  return assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchAssignment = async (studentId, assignmentId) => {
  if (!studentId || !assignmentId) throw new Error('Missing parameters to fetch assignment');
  console.log(`fetching assignment ${assignmentId}`);
  const assignmentRef = doc(db, 'students', studentId, 'assignments', assignmentId);
  const assignmentSnapshot = await getDoc(assignmentRef);
  if (!assignmentSnapshot.exists()) throw new Error('Assignment not found');
  return { id: assignmentSnapshot.id, ...assignmentSnapshot.data() };
}

export const useTrack = ({ trackId }) => {
  const { data: track } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => fetchTrack(trackId),
    enabled: !!trackId
  });
  return { track };
}

export const useCourses = ({ trackId }) => {
  const { data: courses } = useQuery({
    queryKey: ['courses', trackId],
    queryFn: () => fetchCourses(trackId),
    enabled: !!trackId
  });
  return { courses };
}

export const useCourse = ({ trackId, courseId, courseSlug }) => {
  // find course by either id or slug
  let course;
  if (courseId) {
    const { data: courseData } = useQuery({
      queryKey: ['course', trackId, courseId],
      queryFn: () => fetchCourse(trackId, courseId),
      enabled: !!trackId && !!courseId
    });
    course = courseData;
  } else if (courseSlug) {
    const { courses } = useCourses({ trackId });
    course = courses.find(course => course.slug === courseSlug);
  }
  return { course };
}

export const useStudentCourseAssignments = ({ studentId, courseId }) => {
  const { data: assignments } = useQuery({
    queryKey: ['studentCourseAssignments', studentId, courseId],
    queryFn: () => fetchStudentCourseAssignments(studentId, courseId),
    enabled: !!studentId && !!courseId
  });
  return { assignments };
}

export const useAssignment = ({ studentId, assignmentId }) => {
  const { data: assignment } = useQuery({
    queryKey: ['assignment', studentId, assignmentId],
    queryFn: () => fetchAssignment(studentId, assignmentId),
    enabled: !!studentId && !!assignmentId
  });
  return { assignment };
}
