import { Box } from 'lucide-react';
import { Button } from './ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { to: '/cars', label: 'My Cars', authRequired: true },
  { to: '/profile', label: 'Profile', authRequired: true },
  { to: '/change-password', label: 'Change Password', authRequired: true },
  { to: '/about', label: 'About', authRequired: false },
];

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

          <ul className="links hidden lg:flex">
            {navLinks.map(({ to, label, authRequired }) => {
              if (authRequired && !isAuthenticated) return null;
              return (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span className="whitespace-nowrap">{label}</span>
                </NavLink>
              );
            })}
          </ul>
        </div>

        <div className="actions">
          {isAuthenticated ? (
            <>
              <span className="hidden md:flex items-center gap-2">
                <img
                  src={user?.profilePic || '/default-avatar.png'}
                  className="rounded-full object-cover w-8 h-8"
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
