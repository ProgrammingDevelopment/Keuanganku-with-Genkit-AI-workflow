"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Mock checking for stored session
    const storedUser = localStorage.getItem('keuanganku-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && pass === 'password') {
      const mockUser: User = { id: '1', email: 'user@example.com', name: 'Demo User' };
      setUser(mockUser);
      localStorage.setItem('keuanganku-user', JSON.stringify(mockUser));
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push(APP_ROUTES.DASHBOARD);
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('keuanganku-user');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push(APP_ROUTES.LOGIN);
    setLoading(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
