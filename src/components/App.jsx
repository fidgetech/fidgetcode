// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import '../firebase.js'; // initializes firebase and firebase auth
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import ErrorPage from "components/Layout/ErrorPage.jsx";
import MaterialLayout from 'components/Layout/MaterialLayout';
import { AuthProvider, useAuth } from 'components/Auth/AuthContext';
import Authentication from 'components/Auth/Authentication';
import { Typography } from '@mui/material';
import { NotificationProvider } from 'components/Layout/NotificationContext';
import { Notification } from 'components/Layout/Notification';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <PrivateRoute><MaterialLayout /></PrivateRoute>,
      errorElement: <MaterialLayout><ErrorPage /></MaterialLayout>,
      children:
      [
        {
          index: true,
          element: <Typography>hello '/'</Typography>
        },
        {
          path: '/page1',
          element: <Typography>hello '/page1'</Typography>
        },
        {
          path: '/page2',
          element: <Typography>hello '/page2'</Typography>
        },
      ]
    },
    {
      path: '/login',
      element: <Authentication />
    },
  ]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Notification />
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  )
}

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

export default App
