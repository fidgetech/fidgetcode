import { StudentHome } from "./StudentHome";
import { Course } from "./Course";
import { Assignment } from "./Assignment/Assignment";

export const studentRoutes = [
  { path: '', element: <StudentHome /> },
  { path: 'courses/:courseSlug', element: <Course /> },
  { path: 'courses/:courseSlug/assignments/:assignmentId', element: <Assignment /> },
];
