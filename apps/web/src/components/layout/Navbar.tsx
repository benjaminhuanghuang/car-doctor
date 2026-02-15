import { Box } from 'lucide-react';
import { Button } from '../ui/button';
import { NavLink } from 'react-router-dom';

import { ThemeToggle } from '../ThemeToggle';

export default function Navbar() {
  const isSignedIn = false; // Replace with actual authentication logic
  const userName = 'John Doe'; // Replace with actual user name

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Puter sign out failed: ${e}`);
      }

      return;
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`Puter sign in failed: ${e}`);
    }
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
            <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>
              Community
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">{userName ? `Hi, ${userName}` : 'Signed in'}</span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log In
              </Button>

              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
