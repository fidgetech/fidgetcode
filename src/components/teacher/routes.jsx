import { TeacherHome } from './TeacherHome';
import { Track } from './Track';
import { Course } from './Course';
import { Student } from './Student';
import { StudentCourse } from './StudentCourse';
import { AssignmentHandler } from './AssignmentHandler';
import { AssignmentTemplateHandler } from './AssignmentTemplateHandler';

export const teacherRoutes = [
  { path: '', element: <TeacherHome /> },
  { path: 'tracks/:trackId', element: <Track /> },
  { path: 'tracks/:trackId/courses/:courseSlug', element: <Course />},
  { path: 'students/:studentId', element: <Student /> },
  { path: 'tracks/:trackId/courses/:courseSlug/students/:studentId', element: <StudentCourse /> },
  { path: 'students/:studentId/courses/:courseSlug', element: <StudentCourse /> },
  { path: 'students/:studentId/courses/:courseSlug/assignments/:assignmentId', element: <AssignmentHandler /> },
  { path: 'tracks/:trackId/courses/:courseSlug/students/:studentId/assignments/:assignmentId', element: <AssignmentHandler /> },
  { path: 'students/:studentId/courses/:courseSlug/templates/:templateId', element: <AssignmentTemplateHandler /> },
  { path: 'tracks/:trackId/courses/:courseSlug/students/:studentId/templates/:templateId', element: <AssignmentTemplateHandler />}
];
