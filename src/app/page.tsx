"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { APP_ROUTES } from '@/lib/constants';
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace(APP_ROUTES.DASHBOARD);
      } else {
        router.replace(APP_ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg shadow-xl bg-card">
        <Skeleton className="h-12 w-12 rounded-full bg-primary/20" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
