// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from "react-router-dom";
import { RoutingErrorPage, PermissionsErrorPage, MiscErrorPage } from "components/Layout/ErrorPages.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'contexts/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { ThemeProviderWrapper } from 'contexts/ThemeContext';
import Loading from 'components/Layout/Loading';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'lib/queryClient';
import { NotificationProvider } from 'contexts/NotificationContext';
import { Notification } from 'components/Layout/Notification';
import { studentRoutes } from 'student/routes';
import { teacherRoutes } from 'teacher/routes';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <RoutingErrorPage />,
      children: [
        {
          index: true,
          element: <ProtectedRoute allowedRoles={['teacher', 'student']}><Home /></ProtectedRoute>
        },
        {
          path: 'teacher/*',
          element: <ProtectedRoute allowedRoles={['teacher']}><Outlet /></ProtectedRoute>,
          children: teacherRoutes
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

const MainLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();

  return (
    <MaterialLayout staticNavbar={loading}>
      <Notification />
      <ErrorBoundary FallbackComponent={MiscErrorPage} key={location.pathname}>
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
  const { loading, isSignedIn, isTeacher, isStudent } = useAuth();
  const userRole = isTeacher ? 'teacher' : isStudent ? 'student' : null;

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
  const { isTeacher } = useAuth();
  return <Navigate to={isTeacher ? '/teacher' : '/student'} />;
};
