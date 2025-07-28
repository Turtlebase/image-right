
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { Button } from '@/components/ui/button';

export default function RewardedAdOverlay() {
    const { isVisible, hideRewardedAd, callbacks, setAdLoading } = useRewardedAd();
    const [countdown, setCountdown] = useState(15);
    const [rewardEarned, setRewardEarned] = useState(false);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const socialBarContainerRef = useRef<HTMLDivElement>(null);
    const popUnderScriptRef = useRef<HTMLScriptElement | null>(null);
    const socialBarScriptRef = useRef<HTMLScriptElement | null>(null);

    const SOCIAL_BAR_SRC = '//jigsawharmony.com/be/08/4b/be084ba313cde54505eaf796241204e7.js';
    const POP_UNDER_SRC = '//jigsawharmony.com/f7/9b/bc/f79bbcd6e7e077e257ba8026279afdac.js';
    const COUNTDOWN_SECONDS = 15;

    const cleanupScripts = () => {
        if (popUnderScriptRef.current && popUnderScriptRef.current.parentNode) {
            popUnderScriptRef.current.parentNode.removeChild(popUnderScriptRef.current);
            popUnderScriptRef.current = null;
        }
        if (socialBarScriptRef.current && socialBarScriptRef.current.parentNode) {
            socialBarScriptRef.current.parentNode.removeChild(socialBarScriptRef.current);
            socialBarScriptRef.current = null;
        }
        // This is a common pattern for these ad scripts; they inject a div at the end of the body.
        const adsterraDiv = document.querySelector('div[id^="adsterra-"]');
        if (adsterraDiv && adsterraDiv.parentNode) {
            adsterraDiv.parentNode.removeChild(adsterraDiv);
        }
        if (socialBarContainerRef.current) {
            socialBarContainerRef.current.innerHTML = `
                 <div class="ad-placeholder text-sm text-primary">
                    Social Bar Ad Loading...
                </div>
            `;
        }
    };

    const loadSocialBarAd = () => {
        if (socialBarScriptRef.current || !socialBarContainerRef.current) return;
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = SOCIAL_BAR_SRC;
        script.async = true;
        
        script.onload = () => {
            if (socialBarContainerRef.current) {
                socialBarContainerRef.current.innerHTML = `<div class="ad-placeholder text-sm text-green-500">Ad loaded.</div>`;
            }
        };
        script.onerror = () => {
             if (socialBarContainerRef.current) {
                socialBarContainerRef.current.innerHTML = `<div class="ad-placeholder text-sm text-red-500">Ad failed to load.</div>`;
            }
        };

        document.body.appendChild(script);
        socialBarScriptRef.current = script;
    };
    
    const triggerPopUnder = () => {
        if (popUnderScriptRef.current) return;
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = POP_UNDER_SRC;
        script.async = true;

        document.body.appendChild(script);
        popUnderScriptRef.current = script;
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
            className="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center"
            onClick={() => rewardEarned && closeAd(true)}
        >
            <div 
                className="bg-card text-card-foreground rounded-2xl w-[90%] max-w-sm max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col animate-in fade-in-50 zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Rewarded Ad</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${rewardEarned ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
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
                     <div 
                        ref={socialBarContainerRef}
                        className="min-h-[100px] flex items-center justify-center bg-muted/50 rounded-lg mb-5 p-3"
                    >
                        <div className="ad-placeholder text-sm text-primary">
                            Social Bar Ad Loading...
                        </div>
                    </div>
                    
                    <Button onClick={triggerPopUnder} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
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
    );
}
