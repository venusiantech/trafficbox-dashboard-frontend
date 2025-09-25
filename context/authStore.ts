"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';

// Define user type based on API response
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob?: string;
  role: string;
  cashBalance: number;
  credits: number;
  availableHits: number;
  createdAt: string;
  updatedAt?: string;
};

// Define register data type
export type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Define auth store type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Check authentication status
      checkAuth: async () => {
        try {
          // Verify authentication status with server
          const response = await fetch('/api/auth/check');
          const data = await response.json();
          
          if (!data.isAuthenticated) {
            // If not authenticated on server but have user data locally, clear it
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }
          
          // If authenticated on server, keep the current user data
          set(state => ({
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (error) {
          // Error handling auth state, clear data
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // Login function
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }
          
          // Store user data in state
          set({ 
            user: data.user,
            isAuthenticated: true,
            isLoading: false 
          });
          
          return data;
        } catch (err: any) {
          set({ error: err.message || "Login failed", isLoading: false });
          throw err;
        }
      },

      // Register function
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }
          
          // Store user data in state
          set({ 
            user: data.user,
            isAuthenticated: true,
            isLoading: false 
          });
          
          return data;
        } catch (err: any) {
          set({ error: err.message || "Registration failed", isLoading: false });
          throw err;
        }
      },

      // Logout function
      logout: async () => {
        try {
          // Call logout API to clear server-side cookies
          await fetch("/api/auth/logout", {
            method: "POST",
          });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Reset state regardless of API call success
          set({ user: null, isAuthenticated: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name of the item in storage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);

// Hook to initialize auth state
export function useInitAuth() {
  const { checkAuth, isLoading } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return { isLoading };
}
