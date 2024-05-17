import { useMemo } from 'react';
import { db } from 'services/firebase.js';
import { useQuery } from '@tanstack/react-query';
import { doc, collection, collectionGroup, getDoc, getDocs, setDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { useStudentCourseAssignments } from './useStudentData';

const fetchTracks = async () => {
  console.log(`fetching all tracks`);
  const tracksRef = collection(db, 'tracks');
  const tracksQuery = query(tracksRef, orderBy('createdAt', 'desc'));
  const tracksSnapshot = await getDocs(tracksQuery);
  if (tracksSnapshot.empty) throw new Error('No tracks found');
  return tracksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchStudents = async ({ active }) => {
  console.log(`fetching ${active ? 'active' : 'all'} students`);
  const studentsRef = collection(db, 'students');
  const studentsQuery = query(studentsRef, active ? where('active', '==', true) : null, orderBy('name'));
  const studentsSnapshot = await getDocs(studentsQuery);
  return studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchTrackStudents = async (trackId) => {
  if (!trackId) throw new Error('Track ID is required to fetch track students');
  console.log(`fetching students for track ${trackId}`);
  const studentsRef = collection(db, 'students');
  const studentsQuery = query(studentsRef, where('trackId', '==', trackId), orderBy('name'));
  const studentsSnapshot = await getDocs(studentsQuery);
  if (studentsSnapshot.empty) throw new Error('No students found for the given track');
  return studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchStudent = async (studentId) => {
  if (!studentId) throw new Error('Student ID is required to fetch student');
  console.log(`fetching student ${studentId}`);
  const studentRef = doc(db, 'students', studentId);
  const studentDoc = await getDoc(studentRef);
  if (!studentDoc.exists) throw new Error('Student not found');
  return { id: studentDoc.id, ...studentDoc.data() };
}

const fetchCourseAssignmentTemplates = async (trackId, courseId) => {
  if (!courseId || !trackId) throw new Error('Track and Course ID are required to fetch course assignment templates');
  console.log(`fetching assignment templates for course ${courseId}`);
  const courseRef = doc(db, 'tracks', trackId, 'courses', courseId);
  const assignmentTemplatesRef = collection(courseRef, 'assignmentTemplates');
  const assignmentTemplatesQuery = query(assignmentTemplatesRef, orderBy('number'));
  const assignmentTemplatesSnapshot = await getDocs(assignmentTemplatesQuery);
  return assignmentTemplatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchAssignmentSubmissions = async (studentId, assignmentId) => {
  if (!studentId || !assignmentId) throw new Error('Student ID and Assignment ID are required to fetch assignment submissions');
  console.log(`fetching submissions for student ${studentId} and assignment ${assignmentId}`);
  const submissionsRef = collection(db, 'students', studentId, 'assignments', assignmentId, 'submissions');
  const submissionsQuery = query(submissionsRef, orderBy('createdAt', 'desc'));
  const submissionsSnapshot = await getDocs(submissionsQuery);
  return submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchStudentAssignmentsAwaitingReview = async (studentId) => {
  if (!studentId) throw new Error('Student ID is required to fetch student assignments awaiting review');
  console.log(`fetching assignments awaiting review for student ${studentId}`);
  const assignmentsRef = collection(db, 'students', studentId, 'assignments');
  const assignmentsQuery = query(assignmentsRef, where('status', '==', 'submitted'));
  const assignmentsSnapshot = await getDocs(assignmentsQuery);
  return assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchAssignmentsAwaitingReview = async () => {
  console.log(`fetching all assignments awaiting review`);
  const assignmentsRef = collectionGroup(db, 'assignments');
  const assignmentsQuery = query(assignmentsRef, where('status', '==', 'submitted'));
  const assignmentsSnapshot = await getDocs(assignmentsQuery);
  return assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}





export const useTracks = () => {
  const { data: tracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => fetchTracks(),
    enabled: true
  });
  return { tracks };
}

export const useTrackStudents = ({ trackId }) => {
  const { data: students } = useQuery({
    queryKey: ['trackStudents', trackId],
    queryFn: () => fetchTrackStudents(trackId),
    enabled: !!trackId
  });
  return { students };
}

export const useStudent = ({ studentId }) => {
  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudent(studentId),
    enabled: !!studentId
  });
  return { student };
}

export const useStudents = ({ active }) => {
  const { data: students } = useQuery({
    queryKey: ['students', { active }],
    queryFn: () => fetchStudents({ active }),
    enabled: true
  });
  return { students };
}

export const useCourseAssignmentTemplates = ({ trackId, courseId }) => {
  const { data: assignmentTemplates } = useQuery({
    queryKey: ['courseAssignmentTemplates', trackId, courseId],
    queryFn: () => fetchCourseAssignmentTemplates(trackId, courseId),
    enabled: !!courseId && !!trackId
  });
  return { assignmentTemplates };
}

export const useCourseAssignmentTemplatesWithAssignments = ({ trackId, courseId, studentId }) => {
  const { assignmentTemplates } = useCourseAssignmentTemplates({ trackId, courseId });
  const { assignments } = useStudentCourseAssignments({ studentId, courseId });
  const assignmentTemplatesWithAssignments = assignmentTemplates.map(template => {
    const studentAssignment = assignments.find(assignment => assignment.templateId === template.id);
    let status;
    if (!studentAssignment) {
      status = 'Not assigned';
    } else if (studentAssignment.status === 'submitted') {
      status = 'Awaiting teacher review';
    } else if (studentAssignment.status === 'assigned') {
      status = 'Awaiting student submission';
    } else {
      status = 'Unexpected status';
    }
    return { ...template, status, studentAssignment };
  });
  return { assignmentTemplatesWithAssignments };
}

export const useAssignmentSubmissions = ({ studentId, assignmentId }) => {
  const { data: submissions } = useQuery({
    queryKey: ['assignmentSubmissions', studentId, assignmentId],
    queryFn: () => fetchAssignmentSubmissions(studentId, assignmentId),
    enabled: !!studentId && !!assignmentId
  });
  return { submissions };
}

export const useStudentAssignmentsAwaitingReview = ({ studentId }) => {
  const { data: assignments } = useQuery({
    queryKey: ['studentAssignmentsAwaitingReview', studentId],
    queryFn: () => fetchStudentAssignmentsAwaitingReview(studentId),
    enabled: !!studentId
  });
  return { assignments };
}

export const useAssignmentsAwaitingReview = () => {
  const { data: assignments } = useQuery({
    queryKey: ['assignmentsAwaitingReview'],
    queryFn: () => fetchAssignmentsAwaitingReview(),
    enabled: true
  });
  return { assignments };
}

export const useStudentsWithAssignmentsAwaitingReview = () => {
  const { students } = useStudents({ active: true });
  const { assignments } = useAssignmentsAwaitingReview();
  const studentsWithAssignments = useMemo(() => {
    return students.map(student => {
      const studentAssignments = assignments.filter(assignment => assignment.studentId === student.id);
      return { ...student, assignments: studentAssignments };
    });
  }, [students, assignments]);
  return { students: studentsWithAssignments };
}

export const useTracksWithStudents = () => {
  const { tracks } = useTracks();
  const { students } = useStudents({ active: true });
  const tracksWithStudents = useMemo(() => {
    return tracks.map(track => {
      const trackStudents = students.filter(student => student.trackId === track.id);
      return { ...track, students: trackStudents };
    });
  }, [tracks, students]);
  return { tracks: tracksWithStudents };
}



export const assignAssignmentToStudent = async ({ studentId, trackId, courseId, templateId }) => {
  if (!studentId || !trackId || !courseId || !templateId) throw new Error('Student ID, Track ID, Course ID, and Template ID are required to assign assignment to student');
  console.log(`assigning assignment ${templateId} to student ${studentId}`);
  const templateRef = doc(db, 'tracks', trackId, 'courses', courseId, 'assignmentTemplates', templateId);
  const templateDoc = await getDoc(templateRef);
  if (!templateDoc.exists) throw new Error('Assignment template not found');
  const template = { id: templateDoc.id, ...templateDoc.data() };
  const { title, content, objectives, number } = template;
  const assignmentData = {
    createdAt: serverTimestamp(),
    status: 'assigned',
    studentId,
    courseId,
    templateId,
    title,
    content,
    objectives,
    number,
  };
  const assignmentsRef = collection(db, 'students', studentId, 'assignments');
  const existingAssignmentExists  = query(assignmentsRef, where('templateId', '==', templateId));
  if (existingAssignmentExists) {
    await setDoc(doc(assignmentsRef), assignmentData);
  }
}
