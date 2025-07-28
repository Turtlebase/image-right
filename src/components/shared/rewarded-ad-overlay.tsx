
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { Button } from '@/components/ui/button';

export default function RewardedAdOverlay() {
    const { isVisible, hideRewardedAd, callbacks, setAdLoading } = useRewardedAd();
    const [countdown, setCountdown] = useState(15);
    const [rewardEarned, setRewardEarned] = useState(false);
    const [socialBarLoaded, setSocialBarLoaded] = useState(false);
    const [popUnderLoaded, setPopUnderLoaded] = useState(false);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const scriptsContainerRef = useRef<HTMLDivElement>(null);

    const SOCIAL_BAR_SRC = '//jigsawharmony.com/be/08/4b/be084ba313cde54505eaf796241204e7.js';
    const POP_UNDER_SRC = '//jigsawharmony.com/f7/9b/bc/f79bbcd6e7e077e257ba8026279afdac.js';
    const COUNTDOWN_SECONDS = 15;

    const clearScripts = () => {
        if (scriptsContainerRef.current) {
            scriptsContainerRef.current.innerHTML = '';
        }
    };
    
    const loadScript = (src: string, onLoad: () => void, onError: () => void) => {
        if (!scriptsContainerRef.current) return;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.onload = onLoad;
        script.onerror = onError;
        scriptsContainerRef.current.appendChild(script);
    };

    const loadSocialBarAd = () => {
        if (socialBarLoaded) return;
        loadScript(SOCIAL_BAR_SRC, 
            () => setSocialBarLoaded(true), 
            () => console.error('Social bar ad failed to load')
        );
    };

    const triggerPopUnder = () => {
        if (popUnderLoaded) return;
        loadScript(POP_UNDER_SRC, 
            () => setPopUnderLoaded(true), 
            () => console.error('Pop-under ad failed to load')
        );
    };

    const closeAd = (isRewarded: boolean) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        if (isRewarded) {
            callbacks?.onReward();
        } else {
            callbacks?.onError?.();
        }

        hideRewardedAd();
        setRewardEarned(false);
        setSocialBarLoaded(false);
        setPopUnderLoaded(false);
        clearScripts();
    };

    useEffect(() => {
        if (isVisible) {
            setCountdown(COUNTDOWN_SECONDS);
            setRewardEarned(false);
            setAdLoading(true);
            
            // Give a small delay for ad network to initialize
            setTimeout(() => {
                loadSocialBarAd();
                setAdLoading(false);
            }, 500);

            intervalRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setRewardEarned(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isVisible, setAdLoading, callbacks]);

    if (!isVisible) {
        return null;
    }

    const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

    return (
        <>
            <div ref={scriptsContainerRef} style={{ display: 'none' }}></div>
            <div 
                className="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center"
                onClick={() => rewardEarned && closeAd(true)}
            >
                <div 
                    className="bg-card text-card-foreground rounded-2xl w-[90%] max-w-sm max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col animate-in fade-in-50 zoom-in-95 duration-300"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Rewarded Ad</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${rewardEarned ? 'bg-green-500' : 'bg-primary'}`}>
                            {rewardEarned ? 'Done!' : countdown}
                        </span>
                    </div>

                    {rewardEarned && (
                         <button 
                            onClick={() => closeAd(true)}
                            className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full z-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                            &times;
                        </button>
                    )}

                    <div className="p-5 text-center flex-grow flex flex-col justify-center">
                        <div className="min-h-[100px] flex items-center justify-center bg-muted/50 rounded-lg mb-5 p-3">
                            <span className="text-sm text-primary">Social Bar Ad Loading Area</span>
                        </div>
                        <Button onClick={triggerPopUnder}>
                            Click for Special Offer!
                        </Button>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-5 overflow-hidden">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                        </div>
                    </div>
                     {!rewardEarned && (
                        <div className="p-2 text-center text-xs text-muted-foreground">
                            <p>Please wait for the timer to finish to earn your reward.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
