
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { useTelegram } from '@/components/telegram-provider';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  const router = useRouter();
  const { setPlan, isInitialized: isSubInitialized } = useSubscription();
  const { webApp, user } = useTelegram();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Wait until providers are ready before doing anything
    if (!isSubInitialized || !webApp) return;

    // Immediately update the plan to Premium in local storage
    setPlan('Premium');
    
    // Start the countdown to close the window
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // After 5 seconds, attempt to close the webview/tab
    const redirectTimer = setTimeout(() => {
        handleRedirect();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };

  }, [isSubInitialized, webApp, setPlan, router]);

  const handleRedirect = () => {
    // The most reliable way is to just navigate back home in the mini app context
    router.push('/');
    // For external browsers, this might try to close the tab
    if (webApp && webApp.close) {
        webApp.close();
    }
  }

  if (!isSubInitialized) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold mt-4">Finalizing your subscription...</h1>
         </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Welcome to Premium, {user?.first_name || 'friend'}!
      </p>
      <div className="mt-8">
        <p className="text-muted-foreground">
            You will be redirected back to the app in {countdown} seconds.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
            Please do not close this window.
        </p>
        <Button onClick={handleRedirect} className="mt-6">
            Go Back to App Now
        </Button>
      </div>
    </div>
  );
}
