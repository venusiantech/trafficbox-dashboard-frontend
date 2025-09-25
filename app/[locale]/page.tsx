"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/authStore';
import Loader from '@/components/loader';

export default function LocalePage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Initialize auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle redirection based on auth state
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push(`/${locale}/dashboard/analytics`);
      } else {
        router.push(`/${locale}/auth/login`);
      }
    }
  }, [isAuthenticated, isLoading, locale, router]);

  // Show loading while checking auth status
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  );
}