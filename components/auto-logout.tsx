"use client";

import { useAuthStore } from "@/context/authStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Auto logout after inactivity
const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout

const AutoLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showingWarning, setShowingWarning] = useState<boolean>(false);

  // Reset timer on user activity
  const resetTimer = () => {
    setLastActivity(Date.now());
    setShowingWarning(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Check inactivity every minute
    const interval = setInterval(async () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      // If warning time reached, show warning
      if (timeSinceLastActivity >= AUTO_LOGOUT_TIME - WARNING_TIME && !showingWarning) {
        setShowingWarning(true);
        toast.warning("You'll be logged out due to inactivity in 5 minutes", {
          duration: 10000,
          action: {
            label: "Keep me signed in",
            onClick: resetTimer,
          },
        });
      }
      
      // If auto logout time reached, logout
      if (timeSinceLastActivity >= AUTO_LOGOUT_TIME) {
        toast.error("You've been logged out due to inactivity");
        await logout();
      }
    }, 60000); // Check every minute

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [lastActivity, logout, isAuthenticated, showingWarning]);

  // This component doesn't render anything
  return null;
};

export default AutoLogout;