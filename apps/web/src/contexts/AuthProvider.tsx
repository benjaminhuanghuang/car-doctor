import { useState, type ReactNode } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { AuthContext } from './AuthContext';
import type { User, UserProfile } from '@/types/user';

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

  const updateProfile = (profile: UserProfile) => {
    const updated = {
      ...user,
      ...profile,
    };
    setUser(updated);
    setItem('user', updated);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
