
"use client"

import { useTheme } from 'next-themes';
import React, { useEffect, createContext, useContext } from 'react';

// Define the type for the Telegram Web App object
interface TelegramWebApp {
  ready: () => void;
  colorScheme: 'light' | 'dark';
  // Add other properties and methods you might use
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const TelegramContext = createContext<TelegramWebApp | null>(null);

export const useTelegram = () => {
    const context = useContext(TelegramContext);
    if (context === undefined) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
};

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // Sync Telegram's color scheme with the app's theme
      setTheme(tg.colorScheme);
      
      const handleThemeChange = () => {
        setTheme(tg.colorScheme);
      };

      // @ts-ignore - a bit of a hack as the event type is not in the default declaration
      tg.onEvent('themeChanged', handleThemeChange);

      return () => {
        // @ts-ignore
        tg.offEvent('themeChanged', handleThemeChange);
      };

    }
  }, [setTheme]);

  return (
    <TelegramContext.Provider value={typeof window !== 'undefined' && window.Telegram ? window.Telegram.WebApp : null}>
        {children}
    </TelegramContext.Provider>
  );
}
