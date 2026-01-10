"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      showWidget: () => void;
      hideWidget: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export function TawkToScript() {
  useEffect(() => {
    // Check if script is already loaded
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_LoadStart - Tawk_API will be set by the script when it loads
    window.Tawk_LoadStart = new Date();

    // Create and inject the script
    const script = document.createElement("script");
    const firstScript = document.getElementsByTagName("script")[0];
    
    script.async = true;
    script.src = "https://embed.tawk.to/69623e3da17050197cae77b0/1jejs68pc";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Cleanup function (optional, but good practice)
    return () => {
      // Script cleanup if needed
    };
  }, []);

  return null;
}

