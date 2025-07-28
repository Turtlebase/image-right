
"use client";

import { create } from 'zustand';
import React, { createContext, useContext } from 'react';

const SOCIAL_BAR_SRC = '//jigsawharmony.com/be/08/4b/be084ba313cde54505eaf796241204e7.js';
const POP_UNDER_SRC = '//jigsawharmony.com/f7/9b/bc/f79bbcd6e7e077e257ba8026279afdac.js';
const COUNTDOWN_SECONDS = 15;

interface AdCallbacks {
    onReward: () => void;
    onError?: () => void;
    onClose?: () => void;
}

interface RewardedAdState {
    isVisible: boolean;
    isAdLoading: boolean;
    callbacks: AdCallbacks | null;
    showRewardedAd: (callbacks: AdCallbacks) => void;
    hideRewardedAd: () => void;
    setAdLoading: (isLoading: boolean) => void;
}

export const useRewardedAd = create<RewardedAdState>((set) => ({
    isVisible: false,
    isAdLoading: false,
    callbacks: null,
    showRewardedAd: (callbacks) => {
        set({ isVisible: true, callbacks, isAdLoading: true });
    },
    hideRewardedAd: () => set({ isVisible: false, callbacks: null, isAdLoading: false }),
    setAdLoading: (isLoading) => set({ isAdLoading: isLoading }),
}));


const RewardedAdContext = createContext<RewardedAdState | null>(null);

export const RewardedAdProvider = ({ children }: { children: React.ReactNode }) => {
    const store = useRewardedAd();
    return (
        <RewardedAdContext.Provider value={store}>
            {children}
        </RewardedAdContext.Provider>
    );
};
