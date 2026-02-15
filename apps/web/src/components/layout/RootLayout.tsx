import { Outlet, Navigate } from 'react-router-dom';
import Loader from '../Loader';
import Navbar from './Navbar';
import Footer from './Footer';
import { getItem } from '@/lib/localStorage';

const RootLayout = () => {
  const token = getItem<string>('token');
  const user = getItem<{ fullName: string; email: string }>('user');
  const loading = false;

  if (loading) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
