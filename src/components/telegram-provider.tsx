
"use client"

import { useTheme } from 'next-themes';
import React, { useEffect, createContext, useContext, useState } from 'react';

// Define the type for the Telegram Web App object
interface TelegramWebApp {
  ready: () => void;
  colorScheme: 'light' | 'dark';
  initDataUnsafe: {
    user?: TelegramUser;
  };
  close: () => void;
  openLink: (url: string) => void;
  onEvent: (event: 'themeChanged', callback: () => void) => void;
  offEvent: (event: 'themeChanged', callback: () => void) => void;
}

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

interface TelegramContextType {
    webApp: TelegramWebApp | null;
    user: TelegramUser | null;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
    const context = useContext(TelegramContext);
    if (context === undefined || context === null) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
};

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setWebApp(tg);
      
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Sync Telegram's color scheme with the app's theme
      if (tg.colorScheme) {
          setTheme(tg.colorScheme);
      }
      
      const handleThemeChange = () => {
        if (tg.colorScheme) {
            setTheme(tg.colorScheme);
        }
      };

      tg.onEvent('themeChanged', handleThemeChange);

      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };

    }
  }, [setTheme]);

  return (
    <TelegramContext.Provider value={{ webApp, user }}>
        {children}
    </TelegramContext.Provider>
  );
}
