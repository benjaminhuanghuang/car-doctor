import { Box } from 'lucide-react';
import { Button } from './ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Login or Logout button click handler
  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
      return;
    }

    navigate('/login');
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <NavLink to="/" className="brand">
            <Box className="logo" />
            <span className="name">Car Doctor</span>
          </NavLink>

          <ul className="links">
            {isAuthenticated && (
              <NavLink to="/cars" className={({ isActive }) => (isActive ? 'active' : '')}>
                My Cars
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                Profile
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink
                to="/change-password"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Change Password
              </NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
          </ul>
        </div>

        <div className="actions">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 rounded-2xl">
                <img
                  src={user?.profilePic || '/default-avatar.png'}
                  className="avatar"
                  width={12}
                  height={12}
                />
                {`${user?.email}`}
              </span>
              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log In
              </Button>

              <Button onClick={() => navigate('/register')} size="sm" className="cta">
                Get Started
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
