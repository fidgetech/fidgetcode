// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import '../firebase.js'; // initializes firebase and firebase auth
import { createBrowserRouter, RouterProvider, Navigate, Link as RouterLink } from "react-router-dom";
import ErrorPage from "components/Layout/ErrorPage.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'components/Auth/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography, Link } from '@mui/material';
import { NotificationProvider } from 'components/Layout/NotificationContext';
import { Notification } from 'components/Layout/Notification';
import { ThemeProviderWrapper } from 'components/Layout/ThemeContext';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoggedInUserRoute><MaterialLayout /></LoggedInUserRoute>,
      errorElement: <LoggedInUserRoute><MaterialLayout><ErrorPage /></MaterialLayout></LoggedInUserRoute>,
      children:
      [
        {
          index: true,
          element: <Typography><Link component={RouterLink} to='/student'>Link to student page</Link><br /><Link component={RouterLink} to='/admin'>Link to admin page</Link></Typography>
        },
        {
          path: '/student',
          element: <StudentRoute><Typography>hello '/student'</Typography></StudentRoute>
        },
        {
          path: '/admin',
          element: <AdminRoute><Typography>hello '/admin'</Typography></AdminRoute>
        },
      ]
    },
    {
      path: '/login',
      element: <MaterialLayout><Authentication /></MaterialLayout>
    },
  ]);

  return (
    <AuthProvider>
      <ThemeProviderWrapper>
        <NotificationProvider>
          <Notification />
          <RouterProvider router={router} />
        </NotificationProvider>
      </ThemeProviderWrapper>
    </AuthProvider>
  )
}

const LoggedInUserRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, currentAdmin } = useAuth();
  if (currentAdmin) {
    return children;
  } else if (currentUser) {
    return <PermissionsErrorPage />;
  } else {
    return <Navigate to = '/login' />;
  }
}

const StudentRoute = ({ children }) => {
  const { currentUser, currentStudent } = useAuth();
  if (currentStudent) {
    return children;
  } else if (currentUser) {
    return <PermissionsErrorPage />;
  } else {
    return <Navigate to = '/login' />;
  }
}

const PermissionsErrorPage = () => {
  return (
    <Typography>
      You do not have permission to view this page.<br />
      Return to <Link component={RouterLink} to='/'>home page</Link>?
    </Typography>
  );
}
