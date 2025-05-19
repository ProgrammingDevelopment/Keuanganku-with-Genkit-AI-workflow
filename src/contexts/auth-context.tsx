
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
    const storedUser = localStorage.getItem('keuanganku-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    let mockUser: User | null = null;

    if (email === 'user@example.com' && pass === 'password') {
      mockUser = { id: '1', email: 'user@example.com', name: 'Pengguna Demo' };
    } else if (email === 'admin@gmail.com' && pass === 'password') {
      mockUser = { id: '2', email: 'admin@gmail.com', name: 'Pengguna Admin' };
    } else if (email === 'swandarutirtasandhika1@gmail.com' && pass === 'password') {
      mockUser = { id: '3', email: 'swandarutirtasandhika1@gmail.com', name: 'Swandaru T S' };
    }

    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('keuanganku-user', JSON.stringify(mockUser));
      toast({ title: 'Login Berhasil', description: 'Selamat datang kembali!' });
      router.push(APP_ROUTES.DASHBOARD);
    } else {
      toast({
        title: 'Login Gagal',
        description: 'Email atau kata sandi tidak valid.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('keuanganku-user');
    toast({ title: 'Berhasil Keluar', description: 'Anda akan diarahkan ke halaman login.' });
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
