import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthedRoute from '@/components/AuthedRoute';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/change-password',
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/cars',
        element: (
          <ProtectedRoute>
            <CarList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/cars/:id',
        element: (
          <ProtectedRoute>
            <CarDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <AuthedRoute>
        <Login />
      </AuthedRoute>
    ),
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export default router;
