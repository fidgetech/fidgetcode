// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { RoutingErrorPage, PermissionsErrorPage, MiscErrorPage } from "components/Layout/ErrorPages.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'components/Auth/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography } from '@mui/material';
import { NotificationProvider } from 'components/Layout/NotificationContext';
import { Notification } from 'components/Layout/Notification';
import { ThemeProviderWrapper } from 'components/Layout/ThemeContext';
import Loading from 'components/Layout/Loading';
import StudentHome from "components/StudentHome";
import Course from "components/Course";
import Assignment from "components/Assignment";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 12 * 60 * 60 * 1000, // 12 hours (also goes stale on logout or refresh)
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  }
});

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={MiscErrorPage}>
            <Suspense fallback={<Loading text='Fetching data...' fullScreen={true} />}>
              <NotificationProvider>
                <Notification />
                <RouterProvider router={router} />
              </NotificationProvider>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
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
      <Outlet />
    </MaterialLayout>
  );
};

const LoginLayout = () => {
  return (
    <MaterialLayout staticNavbar={true}>
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
