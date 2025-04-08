'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { User } from '@/types/todo';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [users, setUsers] = useLocalStorage<{
    [email: string]: { password: string; user: User };
  }>('users', {});
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    'isAuthenticated',
    false
  );

  // Sync isAuthenticated with user state, but only when user changes
  useEffect(() => {
    const shouldBeAuthenticated = !!user;
    if (shouldBeAuthenticated !== isAuthenticated) {
      setIsAuthenticated(shouldBeAuthenticated);
    }
  }, [user, isAuthenticated]); // Removed setIsAuthenticated from dependencies

  const login = useCallback(
    async (email: string, password: string) => {
      const storedUser = users[email];
      if (storedUser && storedUser.password === password) {
        setUser(storedUser.user);
        return true;
      }
      return false;
    },
    [users, setUser]
  );

const register = useCallback(
  async (name: string, email: string, password: string) => {
    if (users[email]) {
      return false; // User already exists
    }

    const newUser: User = {
      id: crypto.randomUUID(), // Use a stable UUID instead of Date.now()
      name,
      email,
    };

    setUsers({
      ...users,
      [email]: { password, user: newUser },
    });
    setUser(newUser);
    return true;
  },
  [users, setUsers, setUser]
);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);