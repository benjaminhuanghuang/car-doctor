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
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="mx-auto px-4 py-8">
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
