import { Outlet } from 'react-router-dom';
import Loader from '../Loader';
import Navbar from './Navbar';
import Login from '../../pages/Login';
import Footer from './Footer';

const RootLayout = () => {
  //   const { user, loading } = useSelector((state) => state.auth);

  const user = { name: 'Test User' };
  const loading = false;
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {user ? (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="mx-auto px-4 py-8 pt-24 max-w-7xl">
            <Outlet />
          </main>
          <Footer />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default RootLayout;
