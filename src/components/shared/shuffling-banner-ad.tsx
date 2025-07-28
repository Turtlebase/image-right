
"use client";

import { useEffect, useState } from 'react';

const AdBanner = ({ adKey }: { adKey: string }) => {
    return (
        <div className="flex justify-center items-center h-[50px] w-[320px]">
            <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
                atOptions = {
                    'key' : '6ca1d59b14717ee757eba9f85c3dc014',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            `}} />
            <script key={adKey} type="text/javascript" src="//jigsawharmony.com/6ca1d59b14717ee757eba9f85c3dc014/invoke.js" />
        </div>
    );
};

export default function ShufflingBannerAd() {
    const [adKey, setAdKey] = useState(`ad-${Date.now()}`);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => {
            setAdKey(`ad-${Date.now()}`);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Render an empty div with the same class names on the server and during initial client render.
    // This ensures the DOM structure matches between server and client to avoid hydration errors.
    return (
        <div className="flex justify-center items-center h-[50px] bg-background">
            {isMounted && <AdBanner key={adKey} adKey={adKey} />}
        </div>
    );
}
