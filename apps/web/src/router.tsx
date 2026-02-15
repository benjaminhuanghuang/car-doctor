import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Community from './pages/Community';

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
        path: '/login',
        element: <Login />,
      },
      {
        path: '/community',
        element: <Community />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
]);

export default router;
