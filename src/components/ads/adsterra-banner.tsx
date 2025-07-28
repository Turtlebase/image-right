
"use client";

import React, { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const AD_REFRESH_INTERVAL = 30000; // 30 seconds

const AdsterraBanner = () => {
    const { subscription, isInitialized } = useSubscription();
    const bannerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const loadAd = () => {
        if (bannerRef.current) {
            // Clear any previous ad content to force a reload
            bannerRef.current.innerHTML = '';

            const scriptOptions = document.createElement('script');
            scriptOptions.type = 'text/javascript';
            scriptOptions.innerHTML = `
                atOptions = {
                    'key' : '6ca1d59b14717ee757eba9f85c3dc014',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            `;
            
            const scriptInvoke = document.createElement('script');
            scriptInvoke.type = 'text/javascript';
            scriptInvoke.src = '//jigsawharmony.com/6ca1d59b14717ee757eba9f85c3dc014/invoke.js';
            scriptInvoke.async = true;

            bannerRef.current.appendChild(scriptOptions);
            bannerRef.current.appendChild(scriptInvoke);
        }
    };

    useEffect(() => {
        if (isInitialized && subscription.plan !== 'Premium') {
            loadAd(); // Load the first ad immediately

            intervalRef.current = setInterval(() => {
                loadAd();
            }, AD_REFRESH_INTERVAL);
        }

        // Cleanup function to clear interval and remove scripts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (bannerRef.current) {
                bannerRef.current.innerHTML = '';
            }
        };

    }, [subscription.plan, isInitialized]);

    if (!isInitialized || subscription.plan === 'Premium') {
        return null;
    }

    return <div ref={bannerRef} className="w-[320px] h-[50px] mx-auto"></div>;
};

export default AdsterraBanner;
