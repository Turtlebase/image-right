
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
    const router = useRouter();
    const { setPlan } = useSubscription();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Mark the subscription as premium as soon as this page is loaded.
        setPlan('Premium');
        
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.replace('/');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [router, setPlan]);
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold font-headline">Payment Successful!</h1>
            <p className="text-muted-foreground mt-2">
                Your plan has been upgraded to Premium.
            </p>
            <p className="mt-8">
                Redirecting you to the home page in {countdown} seconds...
            </p>
        </div>
    )
}

function SubscriptionSuccessPage() {
    const { isInitialized } = useSubscription();

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Finalizing your subscription...</p>
            </div>
        )
    }
    
    return <SuccessContent />;
}

export default function SuspenseWrapper() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Loading...</p>
            </div>
        }>
            <SubscriptionSuccessPage />
        </Suspense>
    )
}

