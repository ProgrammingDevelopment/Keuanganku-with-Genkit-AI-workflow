
"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoW6VfGObYzdWYQXKLGgkFZsOoyUsXY5M",
  authDomain: "keuanganku-fmt9m.firebaseapp.com",
  projectId: "keuanganku-fmt9m",
  storageBucket: "keuanganku-fmt9m.firebasestorage.app",
  messagingSenderId: "873635183256",
  appId: "1:873635183256:web:c60a9d643c8e19fc88eeed"
};


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
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

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

    if (email === 'akuntamu@gmail.com' && pass === 'tamu123') {
      mockUser = { id: '1', email: 'akuntamu@gmail', name: 'Tamu' };
    } else if (email === 'admin@gmail.com' && pass === 'admin123') {
      mockUser = { id: '2', email: 'admin@gmail.com', name: 'Pengguna Admin' };
    } else if (email === 'swandarutirtasandhika1@gmail.com' && pass === 'tamu123') {
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
