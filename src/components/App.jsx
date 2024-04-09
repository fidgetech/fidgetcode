// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { createBrowserRouter, RouterProvider, Navigate, Link as RouterLink } from "react-router-dom";
import ErrorPage from "components/Layout/ErrorPage.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'components/Auth/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography, Link, Box, CssBaseline } from '@mui/material';
import { NotificationProvider } from 'components/Layout/NotificationContext';
import { Notification } from 'components/Layout/Notification';
import { ThemeProviderWrapper } from 'components/Layout/ThemeContext';
import Loading from 'components/Layout/Loading';
import { StyledPaper } from 'components/Layout/SharedStyles';
import { StudentDataProvider } from "components/StudentDataContext";
import StudentHome from "components/StudentHome";

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
          element: <Home />
        },
        {
          path: '/links',
          element: <Typography><Link component={RouterLink} to='/student'>Link to student page</Link><br /><Link component={RouterLink} to='/admin'>Link to admin page</Link></Typography>
        },
        {
          path: '/student',
          element: <StudentRoute><Typography>hello '/student'</Typography></StudentRoute>
        },
        {
          path: '/admin',
          element: <AdminRoute><Test /></AdminRoute>
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

const LoggedInUserRoute = ({ children }) => {
  const { isSignedIn, loading } = useAuth();
  if (loading) {
    return (
      <>
        <CssBaseline />
        <Box sx={{ my: { xs: 0, sm: 2 } }}>
          <StyledPaper>
            <Loading text='Logging in...' />
          </StyledPaper>
        </Box>
      </>
    );
  } else if (isSignedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

const AdminRoute = ({ children }) => {
  const { isSignedIn, isAdmin } = useAuth();
  if (isAdmin) {
    return children;
  } else if (isSignedIn) {
    return <PermissionsErrorPage />;
  } else {
    return <Navigate to = '/login' />;
  }
}

const StudentRoute = ({ children }) => {
  const { isSignedIn, isStudent } = useAuth();
  if (isStudent) {
    return children;
  } else if (isSignedIn) {
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

const Test = () => {
  return (
    <Typography>hello '/admin'</Typography>
  );
}

const Home = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <Test /> : <StudentHome />;
};
