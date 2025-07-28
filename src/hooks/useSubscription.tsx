
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of your subscription state
interface SubscriptionState {
  plan: 'Free' | 'Premium';
  setPlan: (plan: 'Free' | 'Premium') => void;
}

// Create the Zustand store with persistence
export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      plan: 'Free', // Default plan
      setPlan: (plan) => set({ plan }),
    }),
    {
      name: 'subscription-storage', // Name of the item in storage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);


// Define the shape of your usage state
interface UsageState {
  scansToday: number;
  lastScanDate: string | null;
  recordScan: () => void;
  resetScans: () => void;
}

// Helper to get today's date string
const getToday = () => new Date().toISOString().split('T')[0];

// Create the Zustand store for usage tracking with persistence
export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      scansToday: 0,
      lastScanDate: null,
      recordScan: () => {
        const { scansToday, lastScanDate } = get();
        const today = getToday();
        const newScans = lastScanDate === today ? scansToday + 1 : 1;
        set({ scansToday: newScans, lastScanDate: today });
      },
      resetScans: () => {
         set({ scansToday: 0, lastScanDate: getToday() });
      }
    }),
    {
      name: 'usage-storage', // Name of the item in storage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);
