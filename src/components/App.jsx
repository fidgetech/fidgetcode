// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { RoutingErrorPage, PermissionsErrorPage } from "components/Layout/ErrorPages.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'components/Auth/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography } from '@mui/material';
import { NotificationProvider } from 'components/Layout/NotificationContext';
import { Notification } from 'components/Layout/Notification';
import { ThemeProviderWrapper } from 'components/Layout/ThemeContext';
import Loading from 'components/Layout/Loading';
import { StudentDataProvider } from "components/StudentDataContext";
import StudentHome from "components/StudentHome";
import Course from "components/Course";
import Assignment from "components/Assignment";

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <RoutingErrorPage />,
      children: [
        {
          index: true,
          element: <ProtectedRoute allowedRoles={['admin', 'student']}><Home /></ProtectedRoute>
        },
        {
          path: 'admin/*',
          element: <ProtectedRoute allowedRoles={['admin']}><Outlet /></ProtectedRoute>,
          children: adminRoutes
        },
        {
          path: 'student/*',
          element: <ProtectedRoute allowedRoles={['student']}><Outlet /></ProtectedRoute>,
          children: studentRoutes
        },
        {
          path: '/login',
          element: <Authentication />
        },
      ]
    }
  ]);

  return (
    <AuthProvider>
      <StudentDataProvider>
        <ThemeProviderWrapper>
          <NotificationProvider>
            <Notification />
            <RouterProvider router={router} />
          </NotificationProvider>
        </ThemeProviderWrapper>
      </StudentDataProvider>
    </AuthProvider>
  )
}

const studentRoutes = [
  { path: '', element: <StudentHome /> },
  { path: 'courses/:courseSlug', element: <Course /> },
  { path: 'courses/:courseSlug/assignments/:assignmentId', element: <Assignment /> },
];

const adminRoutes = [
  { path: '', element: <Typography>Admin routes coming soon...</Typography> },
];

const MainLayout = () => {
  return (
    <MaterialLayout>
      <Outlet />
    </MaterialLayout>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loading, isSignedIn, isAdmin, isStudent } = useAuth();
  const userRole = isAdmin ? 'admin' : isStudent ? 'student' : null;

  if (loading) {
    return <Loading text="Checking user permissions..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <PermissionsErrorPage />;
  }

  return children;
};

const Home = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/admin' : '/student'} />;
};
