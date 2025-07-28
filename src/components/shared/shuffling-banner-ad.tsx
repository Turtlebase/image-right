
"use client";

import { useEffect, useState } from 'react';

const AdBanner = ({ adKey }: { adKey: string }) => {
    // This component now directly renders the script tags.
    // The parent component will use a `key` to force a full re-mount, ensuring these scripts re-execute.
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

    if (!isMounted) {
        // Render a placeholder with the same dimensions to avoid layout shifts and hydration errors
        return <div className="flex justify-center items-center h-[50px] bg-background" />;
    }

    return (
        <div className="flex justify-center items-center h-[50px] bg-background">
            <AdBanner key={adKey} adKey={adKey} />
        </div>
    );
}
