"use client";

import { useAuthStore } from "@/context/authStore";
import { useEffect } from "react";

export function AuthInit() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return null; // This component doesn't render anything
}

export default AuthInit;
