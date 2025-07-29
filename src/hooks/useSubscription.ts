
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SubscriptionState {
  isPremium: boolean;
  premiumExpiry: number | null;
  setPremium: () => void;
  checkSubscriptionStatus: () => void;
}

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export const useSubscription = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      premiumExpiry: null,
      setPremium: () => {
        const expiryDate = Date.now() + THIRTY_DAYS_IN_MS;
        set({ isPremium: true, premiumExpiry: expiryDate });
      },
      checkSubscriptionStatus: () => {
        const { premiumExpiry } = get();
        if (premiumExpiry && Date.now() > premiumExpiry) {
          set({ isPremium: false, premiumExpiry: null });
        }
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
