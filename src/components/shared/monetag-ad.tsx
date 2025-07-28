
"use client";

import { useEffect } from 'react';

declare global {
    interface Window {
        show_9631988?: (options: object) => void;
    }
}

export default function MonetagAd() {
  useEffect(() => {
    // Ad scripts can be tricky to time.
    // We'll wait a moment and then check if the function is available.
    const timer = setTimeout(() => {
        if (typeof window.show_9631988 === 'function') {
          window.show_9631988({
            type: 'inApp',
            inAppSettings: {
              frequency: 2,
              capping: 0.1,
              interval: 30,
              timeout: 5,
              everyPage: false
            }
          });
        }
    }, 1500); // Wait 1.5 seconds to give the SDK time to load

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything visible
}
