
"use client";

import { useEffect } from 'react';

declare global {
    interface Window {
        show_9631988: (options: object) => void;
    }
}

export default function MonetagAd() {
  useEffect(() => {
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
  }, []);

  return null; // This component doesn't render anything visible
}
