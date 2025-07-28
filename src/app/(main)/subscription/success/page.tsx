
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useTelegram } from '@/components/telegram-provider';
import { useSubscription } from '@/hooks/useSubscription';

export default function SubscriptionSuccessPage() {
    const router = useRouter();
    const { webApp } = useTelegram();
    const { setPlan, isInitialized: isSubscriptionInitialized } = useSubscription();
    const [countdown, setCountdown] = useState(5);

    const handleRedirect = () => {
        if (webApp) {
            // This tells the Telegram app to close the external browser window.
            webApp.close();
        } else {
            // Fallback for regular browsers
            router.push('/');
        }
    };

    useEffect(() => {
        if (!isSubscriptionInitialized) {
            return; // Wait for the subscription context to be ready
        }
        
        // Set the plan to premium as soon as the success page is loaded and context is ready
        setPlan('Premium');

        if (countdown <= 0) {
            handleRedirect();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, isSubscriptionInitialized, setPlan]);

    if (!isSubscriptionInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Finalizing your subscription...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle>Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Your premium subscription is now active. Thank you for your support!
                    </p>
                    <p className="text-lg font-semibold">
                        You will be redirected back to the app in {countdown}...
                    </p>
                    <div className="text-xs text-muted-foreground">
                       Do not close this window. You are being redirected.
                    </div>
                    <Button onClick={handleRedirect} className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to App Now
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
