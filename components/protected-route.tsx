"use client";

import { useAuthStore } from "@/context/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const router = useRouter();
  const pathname = usePathname();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Check auth on mount and when pathname changes (e.g., after redirects)
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setHasCheckedAuth(true);
    };
    
    verifyAuth();
  }, [checkAuth, pathname]);

  useEffect(() => {
    // Only redirect if we've checked auth and user is not authenticated
    if (hasCheckedAuth && !isLoading && !isAuthenticated) {
      // Get locale from pathname or default to 'en'
      const locale = pathname?.split('/')[1] || 'en';
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, isLoading, hasCheckedAuth, router, pathname]);

  // Show loading indicator while checking authentication
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;