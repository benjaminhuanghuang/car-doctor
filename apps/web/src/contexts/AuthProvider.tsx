import { useState, type ReactNode } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { AuthContext, type User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getItem<User>('user'));
  const [token, setToken] = useState<string | null>(() => getItem<string>('token'));

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setItem('token', newToken);
    setItem('user', newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
