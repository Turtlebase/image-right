
"use client";

import dynamic from 'next/dynamic';

const RewardedAdOverlay = dynamic(() => import('@/components/shared/rewarded-ad-overlay'), { ssr: false });

export default function ClientRewardedAd() {
    return <RewardedAdOverlay />;
}
