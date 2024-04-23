import { TeacherHome } from './TeacherHome';
import { Track } from './Track';
import { Course } from './Course';
import { Student } from './Student';
import { StudentCourse } from './StudentCourse';
import { AssignmentHandler } from './AssignmentHandler';

export const teacherRoutes = [
  { path: '', element: <TeacherHome /> },
  { path: 'tracks/:trackId', element: <Track /> },
  { path: 'tracks/:trackId/courses/:courseSlug', element: <Course />},
  { path: 'tracks/:trackId/students/:studentId', element: <Student /> },
  { path: 'tracks/:trackId/courses/:courseSlug/students/:studentId', element: <StudentCourse /> },
  { path: 'tracks/:trackId/students/:studentId/courses/:courseSlug', element: <StudentCourse /> },
  { path: 'tracks/:trackId/students/:studentId/courses/:courseSlug/assignments/:assignmentId', element: <AssignmentHandler /> },
  { path: 'tracks/:trackId/courses/:courseSlug/students/:studentId/assignments/:assignmentId', element: <AssignmentHandler /> },
];
