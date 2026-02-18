import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface AuthedRouteProps {
  children: ReactNode;
}

const AuthedRoute = ({ children }: AuthedRouteProps) => {
  const { token, user } = useAuth();

  if (token || user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthedRoute;
