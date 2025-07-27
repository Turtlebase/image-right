
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FREE_SCAN_LIMIT = 5;
const REWARDED_SCAN_LIMIT = 20; // 5 free + 15 rewarded
const PREMIUM_SCAN_LIMIT = 9999; // Effectively unlimited

const SUBSCRIPTION_KEY = 'image-rights-ai-subscription';

export type SubscriptionPlan = 'Free' | 'Premium';
export type ScanStatus = 'can_scan_free' | 'can_scan_with_ad' | 'limit_reached';

interface SubscriptionState {
  plan: SubscriptionPlan;
  scansToday: number;
  lastScanDate: string | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionState & { 
    freeScanLimit: number;
    rewardedScanLimit: number;
    premiumScanLimit: number;
    plan: SubscriptionPlan;
  };
  setPlan: (plan: SubscriptionPlan) => void;
  recordScan: () => void;
  canScan: () => ScanStatus;
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    try {
        const savedState = localStorage.getItem(SUBSCRIPTION_KEY);
        const today = new Date().toISOString().split('T')[0];
        let initialState: SubscriptionState;

        if (savedState) {
            const parsedState: SubscriptionState = JSON.parse(savedState);
            if (parsedState.lastScanDate !== today) {
                // Reset scans for the new day
                initialState = { ...parsedState, scansToday: 0, lastScanDate: today };
            } else {
                initialState = parsedState;
            }
        } else {
            // No saved state, create a fresh one
            initialState = { plan: 'Free', scansToday: 0, lastScanDate: today };
        }
        setSubscription(initialState);
    } catch (error) {
        console.error("Failed to load subscription state:", error);
        // Fallback to a default state in case of error
        const today = new Date().toISOString().split('T')[0];
        setSubscription({ plan: 'Free', scansToday: 0, lastScanDate: today });
    } finally {
        setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Only save to localStorage if state has been initialized from it first
    if (isInitialized) {
        try {
            localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
        } catch (error) {
            console.error("Failed to save subscription state:", error);
        }
    }
  }, [subscription, isInitialized]);


  const setPlan = useCallback((newPlan: SubscriptionPlan) => {
    setSubscription(prev => ({ ...prev, plan: newPlan, scansToday: 0 }));
  }, []);

  const recordScan = useCallback(() => {
    setSubscription(prev => {
        const today = new Date().toISOString().split('T')[0];
        const scansToday = prev.lastScanDate === today ? prev.scansToday + 1 : 1;
        return {
            ...prev,
            scansToday,
            lastScanDate: today,
        };
    });
  }, []);
  
  const canScan = useCallback((): ScanStatus => {
    if (subscription.plan === 'Premium') {
        return 'can_scan_free';
    }
    if (subscription.scansToday < FREE_SCAN_LIMIT) {
        return 'can_scan_free';
    }
    if (subscription.scansToday < REWARDED_SCAN_LIMIT) {
        return 'can_scan_with_ad';
    }
    return 'limit_reached';
  }, [subscription.plan, subscription.scansToday]);

  const value = {
    subscription: { 
        ...subscription, 
        freeScanLimit: FREE_SCAN_LIMIT,
        rewardedScanLimit: REWARDED_SCAN_LIMIT,
        premiumScanLimit: PREMIUM_SCAN_LIMIT,
        plan: subscription.plan,
    },
    setPlan,
    recordScan,
    canScan,
    isInitialized,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
