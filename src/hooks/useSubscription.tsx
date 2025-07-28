
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FREE_SCAN_LIMIT = 5;
const REWARDED_SCAN_LIMIT = 30; // 5 free + 25 rewarded

const USAGE_KEY = 'image-rights-ai-usage';

export type ScanStatus = 'can_scan_free' | 'can_scan_with_ad' | 'limit_reached';

interface UsageState {
  scansToday: number;
  lastScanDate: string | null;
}

interface SubscriptionContextType {
  subscription: UsageState & { 
    freeScanLimit: number;
    rewardedScanLimit: number;
  };
  recordScan: () => void;
  canScan: () => ScanStatus;
  isInitialized: boolean;
  refreshSubscription: () => void;
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
  const [usage, setUsage] = useState<UsageState>({
    scansToday: 0,
    lastScanDate: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const loadState = useCallback(() => {
    try {
        const savedState = localStorage.getItem(USAGE_KEY);
        const today = new Date().toISOString().split('T')[0];
        let initialState: UsageState;

        if (savedState) {
            const parsedState: UsageState = JSON.parse(savedState);
            if (parsedState.lastScanDate !== today) {
                initialState = { ...parsedState, scansToday: 0, lastScanDate: today };
            } else {
                initialState = parsedState;
            }
        } else {
            initialState = { scansToday: 0, lastScanDate: today };
        }
        setUsage(initialState);
    } catch (error) {
        console.error("Failed to load usage state:", error);
        const today = new Date().toISOString().split('T')[0];
        setUsage({ scansToday: 0, lastScanDate: today });
    } finally {
        if (!isInitialized) {
            setIsInitialized(true);
        }
    }
  }, [isInitialized]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const refreshSubscription = useCallback(() => {
    loadState();
  }, [loadState]);


  useEffect(() => {
    if (isInitialized) {
        try {
            localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
        } catch (error) {
            console.error("Failed to save usage state:", error);
        }
    }
  }, [usage, isInitialized]);

  const recordScan = useCallback(() => {
    setUsage(prev => {
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
    if (usage.scansToday < FREE_SCAN_LIMIT) {
        return 'can_scan_free';
    }
    if (usage.scansToday < REWARDED_SCAN_LIMIT) {
        return 'can_scan_with_ad';
    }
    return 'limit_reached';
  }, [usage.scansToday]);

  const value = {
    subscription: { 
        ...usage, 
        freeScanLimit: FREE_SCAN_LIMIT,
        rewardedScanLimit: REWARDED_SCAN_LIMIT,
    },
    recordScan,
    canScan,
    isInitialized,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
