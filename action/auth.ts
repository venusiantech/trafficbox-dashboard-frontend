"use server";

import { backendURL } from "@/config";

// Types for login
type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
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
};

// Types for registration
type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    cashBalance: number;
    credits: number;
    availableHits: number;
    createdAt: string;
  };
};

/**
 * Login user with email and password
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${backendURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
}

/**
 * Register new user
 */
export async function registerUser(userData: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${backendURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
}

/**
 * Verify token is valid
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    // This is a placeholder - typically you'd have a verify endpoint
    // For now, we'll just check if the token can be decoded and isn't expired
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() < expirationTime;
  } catch (error) {
    return false;
  }
}
