"use client";

// Set token in cookies
export const setAuthCookie = (token: string) => {
  // Set token with expiry of 7 days
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
};

// Get token from cookies
export const getAuthCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length);
    }
  }
  return null;
};

// Remove token from cookies
export const removeAuthCookie = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
};

// Set user data in local storage
export const setUserData = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user data from local storage
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Remove user data from local storage
export const removeUserData = () => {
  localStorage.removeItem('user');
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    // If token is invalid, consider it expired
    return true;
  }
};

// Clear all auth data
export const clearAuthData = () => {
  removeAuthCookie();
  removeUserData();
};
