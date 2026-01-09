"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// Define auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

// Define register data type
type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
});

// Auth provider component
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing user data on mount and verify authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          // Verify authentication status with server
          const response = await fetch('/api/auth/check');
          const data = await response.json();
          
          if (data.isAuthenticated) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // If not authenticated on server but have user data locally, clear it
            clearUserData();
          }
        }
      } catch (error) {
        // Error handling auth state, clear data
        clearUserData();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Clear user data from localStorage
  const clearUserData = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
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
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      router.push("/en/dashboard/analytics");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
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
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      router.push("/en/dashboard/analytics");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Clear user data from localStorage
      localStorage.removeItem("user");
      
      // Clear subscription storage
      localStorage.removeItem("subscription-storage");
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      router.push("/en/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("subscription-storage");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/en/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;