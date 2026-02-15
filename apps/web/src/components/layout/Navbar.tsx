import { Box } from 'lucide-react';
import { Button } from '../ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/login');
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
            <NavLink to="/cars" className={({ isActive }) => (isActive ? 'active' : '')}>
              My Cars
            </NavLink>
            <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>
              Community
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
          </ul>
        </div>

        <div className="actions">
          {isAuthenticated ? (
            <>
              <span className="greeting">
                {user?.fullName ? `Hi, ${user.fullName}` : 'Signed in'}
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
