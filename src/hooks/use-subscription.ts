
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FREE_SCAN_LIMIT = 5;
const PREMIUM_SCAN_LIMIT = 9999; // Effectively unlimited

const SUBSCRIPTION_KEY = 'image-rights-ai-subscription';

export type SubscriptionPlan = 'Free' | 'Premium';

interface SubscriptionState {
  plan: SubscriptionPlan;
  scansToday: number;
  lastScanDate: string | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionState & { scanLimit: number };
  setPlan: (plan: SubscriptionPlan) => void;
  recordScan: () => void;
  canScan: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    plan: 'Free',
    scansToday: 0,
    lastScanDate: null,
  });
  
  // Load subscription state from localStorage on initial render
  useEffect(() => {
    try {
        const savedState = localStorage.getItem(SUBSCRIPTION_KEY);
        if (savedState) {
            const parsedState: SubscriptionState = JSON.parse(savedState);
            const today = new Date().toISOString().split('T')[0];
            
            // Reset daily scan count if it's a new day
            if (parsedState.lastScanDate !== today) {
                parsedState.scansToday = 0;
                parsedState.lastScanDate = today;
            }
            setSubscription(parsedState);
        } else {
             // Set initial state for a new user
            const today = new Date().toISOString().split('T')[0];
            setSubscription({ plan: 'Free', scansToday: 0, lastScanDate: today });
        }
    } catch (error) {
        console.error("Failed to load subscription state:", error);
    }
  }, []);

  // Save subscription state to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    } catch (error) {
        console.error("Failed to save subscription state:", error);
    }
  }, [subscription]);


  const setPlan = useCallback((newPlan: SubscriptionPlan) => {
    setSubscription(prev => ({ ...prev, plan: newPlan }));
  }, []);

  const recordScan = useCallback(() => {
    setSubscription(prev => {
        const today = new Date().toISOString().split('T')[0];
        // Check if we need to reset the count for a new day
        const scansToday = prev.lastScanDate === today ? prev.scansToday + 1 : 1;
        return {
            ...prev,
            scansToday,
            lastScanDate: today,
        };
    });
  }, []);
  
  const scanLimit = subscription.plan === 'Premium' ? PREMIUM_SCAN_LIMIT : FREE_SCAN_LIMIT;

  const canScan = useCallback(() => {
    return subscription.scansToday < scanLimit;
  }, [subscription.scansToday, scanLimit]);

  const value = {
    subscription: { ...subscription, scanLimit },
    setPlan,
    recordScan,
    canScan,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
