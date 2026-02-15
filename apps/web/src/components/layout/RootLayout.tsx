import { Outlet, Navigate } from 'react-router-dom';
import Loader from '../Loader';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
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
