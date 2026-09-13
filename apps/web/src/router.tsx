import { createBrowserRouter, Outlet } from 'react-router';
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
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/about',
        Component: About,
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
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: CarList },
          { path: ':id', Component: CarDetail },
        ],
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
    Component: Register,
  },
]);

export default router;
