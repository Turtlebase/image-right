
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const POP_UNDER_SRC = '//jigsawharmony.com/f7/9b/bc/f79bbcd6e7e077e257ba8026279afdac.js';
const COUNTDOWN_SECONDS = 15;

const AdBanner = ({ adKey, adFormat, height, width, invokeUrl, params = {}, id, className }: { adKey: string, adFormat: string, height: number, width: number, invokeUrl: string, params?: object, id?: string, className?: string }) => {
    // This component now directly renders the script tags.
    // The parent component will use a `key` to force a full re-mount, ensuring these scripts re-execute.
    return (
        <div className={cn("flex justify-center items-center", className)}>
            <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
                atOptions = {
                    'key' : '${adKey}',
                    'format' : '${adFormat}',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : ${JSON.stringify(params)}
                };
            `}} />
            <script type="text/javascript" src={invokeUrl} />
            {id && <div id={id}></div>}
        </div>
    );
};


export default function RewardedAdOverlay() {
    const { isVisible, hideRewardedAd, callbacks, setAdLoading } = useRewardedAd();
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [rewardEarned, setRewardEarned] = useState(false);
    const [adRenderKey, setAdRenderKey] = useState(0);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const triggerPopUnder = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = POP_UNDER_SRC;
        script.async = true;
        document.body.appendChild(script);
        setTimeout(() => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }, 5000);
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
    };

    useEffect(() => {
        if (isVisible) {
            // By changing the key, we force all AdBanner components to re-mount and scripts to re-run
            setAdRenderKey(prev => prev + 1);
            setCountdown(COUNTDOWN_SECONDS);
            setRewardEarned(false);
            setAdLoading(true);
            
            const adLoadTimer = setTimeout(() => setAdLoading(false), 500);

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

             return () => {
                clearTimeout(adLoadTimer);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [isVisible, setAdLoading]);

    if (!isVisible) {
        return null;
    }

    const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

    return (
        <div 
            className="fixed inset-0 bg-background z-[10000] flex justify-center items-center animate-in fade-in-50 duration-300"
        >
            <div className="bg-background text-card-foreground w-full h-full overflow-y-auto flex flex-col">
                <header className="p-4 border-b border-border flex justify-between items-center h-16 flex-shrink-0 sticky top-0 bg-background z-10">
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

                <main className="flex-grow flex flex-col items-center justify-around p-4 space-y-4">
                    
                    {/* Native Ad Banner - Requires slightly different handling for the container div */}
                    <div key={`ad3-container-${adRenderKey}`} className="w-[320px] mx-auto">
                        <script async={true} data-cfasync="false" src="//jigsawharmony.com/70c52ea26480db13807224ac8a8adc70/invoke.js"></script>
                        <div id="container-70c52ea26480db13807224ac8a8adc70" className="grid grid-cols-2 gap-2"></div>
                    </div>


                    {/* Call to Action Button */}
                    <Button onClick={triggerPopUnder} size="lg" className="h-auto text-base py-3 px-6 rounded-full shadow-lg">
                        Click Here to Continue
                    </Button>
                    
                     {/* 300x250 Banner Ad */}
                    <AdBanner
                        key={`ad1-${adRenderKey}`}
                        adKey="4a438c82eba6d0eba9a94cc987ed87cb"
                        invokeUrl="//jigsawharmony.com/4a438c82eba6d0eba9a94cc987ed87cb/invoke.js"
                        adFormat="iframe"
                        height={250}
                        width={300}
                        className="min-h-[250px] w-[300px]"
                    />

                    {/* 320x50 Banner Ad */}
                    <AdBanner
                        key={`ad2-${adRenderKey}`}
                        adKey="6ca1d59b14717ee757eba9f85c3dc014"
                        invokeUrl="//jigsawharmony.com/6ca1d59b14717ee757eba9f85c3dc014/invoke.js"
                        adFormat="iframe"
                        height={50}
                        width={320}
                        className="min-h-[50px] w-[320px]"
                    />
                    
                </main>

                <footer className="p-4 flex-shrink-0 sticky bottom-0 bg-background z-10 border-t">
                     <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                    </div>
                     <p className="text-center text-xs text-muted-foreground mt-2">
                        {rewardEarned 
                            ? "Reward earned! You can now close this window."
                            : "Please wait for the timer to finish to earn your reward."
                        }
                    </p>
                </footer>
            </div>
        </div>
    );
}
