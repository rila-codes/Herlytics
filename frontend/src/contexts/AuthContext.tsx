import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateProfileName: (firstName: string, lastName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: accessToken, refreshToken, id, firstName, lastName } = response.data;
      
      const loggedUser: User = { id, email, firstName, lastName };
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      setToken(accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      // If backend is not running / network error, fallback to local user session for frontend preview
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '{}');
        const registered = demoUsers[email.toLowerCase()];
        
        const loggedUser: User = {
          id: Date.now(),
          email,
          firstName: registered?.firstName || email.split('@')[0] || 'User',
          lastName: registered?.lastName || '',
        };
        const demoToken = 'demo-jwt-token-' + Date.now();
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        
        setToken(demoToken);
        setUser(loggedUser);
        return;
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await api.post('/api/auth/register', { email, password, firstName, lastName });
    } catch (err: any) {
      // If backend is not running / network error, save user locally so preview works seamlessly
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '{}');
        demoUsers[email.toLowerCase()] = { email, password, firstName, lastName };
        localStorage.setItem('demo_users', JSON.stringify(demoUsers));
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfileName = (firstName: string, lastName: string) => {
    if (user) {
      const updatedUser = { ...user, firstName, lastName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfileName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
