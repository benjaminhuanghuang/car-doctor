import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';
import CarList from './pages/CarList';

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
        path: '/community',
        element: <Community />,
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
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export default router;
