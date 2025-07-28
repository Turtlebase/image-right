
"use client";

import React, { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const AdsterraBanner = () => {
    const { subscription, isInitialized } = useSubscription();
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isInitialized || subscription.plan === 'Premium' || !bannerRef.current) {
            return;
        }

        // Clear any previous ad content
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

        // Cleanup function to remove scripts when component unmounts
        return () => {
            if (bannerRef.current) {
                bannerRef.current.innerHTML = '';
            }
        };

    }, [subscription.plan, isInitialized]);

    if (!isInitialized || subscription.plan === 'Premium') {
        return null;
    }

    return <div ref={bannerRef} className="w-[320px] h-[50px]"></div>;
};

export default AdsterraBanner;
