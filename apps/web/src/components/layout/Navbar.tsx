import { NavLink } from 'react-router-dom';

import { ThemeToggle } from '../ThemeToggle';

export default function Navbar() {
  return (
    <nav className="flex gap-4 w-full items-center">
      <div className="flex gap-4 text-lg">
        <NavLink to="/">Home page</NavLink>
        <ul className="flex gap-4 text-lg">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </div>
      <ThemeToggle />
    </nav>
  );
}
