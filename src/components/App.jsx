// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { RoutingErrorPage, PermissionsErrorPage, MiscErrorPage } from "components/Layout/ErrorPages.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'contexts/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography } from '@mui/material';
import { ThemeProviderWrapper } from 'contexts/ThemeContext';
import Loading from 'components/Layout/Loading';
import StudentHome from "components/StudentHome";
import Course from "components/Course";
import { Assignment } from "components/Assignment/Assignment";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'lib/queryClient';
import { NotificationProvider } from 'contexts/NotificationContext';
import { Notification } from 'components/Layout/Notification';

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
      ]
    },
    {
      path: '/login',
      element: <LoginLayout />
    }
  ]);

  return (
    <ThemeProviderWrapper>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </NotificationProvider>
    </ThemeProviderWrapper>
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
  const { loading } = useAuth();

  return (
    <MaterialLayout staticNavbar={loading}>
      <Notification />
      <ErrorBoundary FallbackComponent={MiscErrorPage}>
        <Suspense fallback={<Loading text='Fetching data...' />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </MaterialLayout>
  );
};

const LoginLayout = () => {
  return (
    <MaterialLayout>
      <Notification />
      <Authentication />
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
