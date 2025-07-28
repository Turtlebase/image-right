
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function RewardedAdOverlay() {
    const { isVisible, hideRewardedAd, callbacks, setAdLoading } = useRewardedAd();
    const [countdown, setCountdown] = useState(15);
    const [rewardEarned, setRewardEarned] = useState(false);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const adContainerRef = useRef<HTMLDivElement>(null);

    const SOCIAL_BAR_SRC = '//jigsawharmony.com/be/08/4b/be084ba313cde54505eaf796241204e7.js';
    const POP_UNDER_SRC = '//jigsawharmony.com/f7/9b/bc/f79bbcd6e7e077e257ba8026279afdac.js';
    const COUNTDOWN_SECONDS = 15;
    
    const cleanupScripts = () => {
        const adsterraScripts = document.querySelectorAll('script[src*="jigsawharmony.com"]');
        adsterraScripts.forEach(script => script.remove());
        
        const adsterraDivs = document.querySelectorAll('div[style*="z-index: 2147483647"]');
        adsterraDivs.forEach(div => div.remove());

        if (adContainerRef.current) {
            const socialBarPlaceholder = adContainerRef.current.querySelector('#social-bar-ad');
            if (socialBarPlaceholder) {
                socialBarPlaceholder.innerHTML = '';
            }
        }
    };

    const loadSocialBarAd = () => {
        if (!adContainerRef.current) return;
        
        const placeholder = adContainerRef.current.querySelector('#social-bar-ad');
        if(!placeholder) return;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = SOCIAL_BAR_SRC;
        script.async = true;

        placeholder.appendChild(script);
    };

    const triggerPopUnder = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = POP_UNDER_SRC;
        script.async = true;
        document.body.appendChild(script);

        // The script removes itself, but we can clean up just in case
        setTimeout(() => script.remove(), 5000);
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
        
        cleanupScripts();
        hideRewardedAd();
    };


    useEffect(() => {
        if (isVisible) {
            setCountdown(COUNTDOWN_SECONDS);
            setRewardEarned(false);
            setAdLoading(true);
            
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
            cleanupScripts();
        };
    }, [isVisible, setAdLoading]);

    if (!isVisible) {
        return null;
    }

    const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

    return (
        <div 
            className="fixed inset-0 bg-background z-[10000] flex justify-center items-center animate-in fade-in-50 duration-300"
            ref={adContainerRef}
        >
            <div 
                className="bg-background text-card-foreground w-full h-full overflow-hidden flex flex-col"
            >
                <header className="p-4 border-b border-border flex justify-between items-center h-16 flex-shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">Rewarded Ad</span>
                     {rewardEarned ? (
                        <button 
                            onClick={() => closeAd(true)}
                            className="bg-background/80 text-foreground rounded-full z-10 flex items-center justify-center hover:bg-muted/80 transition-colors p-2"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-primary text-primary-foreground`}>
                            {countdown}
                        </span>
                    )}
                </header>

                <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                     <div 
                        id="social-bar-ad"
                        className="w-full min-h-[120px] flex items-center justify-center bg-muted/50 rounded-lg mb-8 p-4 border border-dashed"
                    >
                        <p className="text-sm text-muted-foreground">Ad loading...</p>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2">Special Offer Unlocked!</h2>
                    <p className="text-muted-foreground mb-6">Click below to view our exclusive offer while you wait.</p>

                    <Button onClick={triggerPopUnder} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 h-auto text-base">
                        View Special Offer
                    </Button>
                </main>

                <footer className="p-4 flex-shrink-0">
                     <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                    </div>
                    {!rewardEarned && (
                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Please wait for the timer to finish to earn your reward.
                        </p>
                    )}
                     {rewardEarned && (
                        <p className="text-center text-xs text-green-500 font-semibold mt-2">
                           Reward earned! You can now close this window.
                        </p>
                    )}
                </footer>
            </div>
        </div>
    );
}
