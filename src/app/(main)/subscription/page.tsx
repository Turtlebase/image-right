
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useTelegram } from '@/components/telegram-provider';
import { CheckCircle, Star, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const plans = {
    Free: {
        name: 'Free',
        price: '$0/mo',
        features: [
            '5 free image checks per day',
            '15 additional checks with rewarded ads',
            'Basic copyright results',
            'Unlock full results with rewarded ads',
            'Save up to 5 history reports',
        ]
    },
    Premium: {
        name: 'Premium',
        price: '₹99/mo',
        features: [
            'Unlimited image checks',
            'Advanced, detailed results',
            'No ads, ever',
            'Save all history reports',
            'Export reports as PDF',
        ]
    }
}

export default function SubscriptionPage() {
    const { subscription, isInitialized, refreshSubscription } = useSubscription();
    const { user, webApp } = useTelegram();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!webApp) {
            toast({
                variant: 'destructive',
                title: 'Not in Telegram',
                description: 'This feature is only available within the Telegram app.',
            });
            setIsLoading(false);
            return;
        }

        if (!planId || !keyId || !user) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Payment details are not configured. Please contact support.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const options = {
                key: keyId,
                plan_id: planId,
                name: 'ImageRights AI Premium',
                description: 'Monthly Subscription',
                callback_url: `${window.location.origin}/subscription/success?user_id=${user.id}`,
                redirect: true,
                 config: {
                    display: {
                        hide: [{ method: 'upi' }]
                    }
                }
            };
            // @ts-ignore
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Razorpay Error:", error);
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: 'Could not initiate the payment process. Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshSubscription();
        await new Promise(res => setTimeout(res, 500));
        setIsRefreshing(false);
        toast({
            title: "Status Refreshed",
            description: "Your subscription plan has been updated.",
        });
        router.push('/');
    }

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Loading plans...</p>
            </div>
        );
    }

    return (
        <div className="p-4 animate-in fade-in-50 duration-500">
            <div className="my-8 text-center">
                <h1 className="text-3xl font-bold font-headline">Choose Your Plan</h1>
                <p className="text-muted-foreground mt-2">Unlock more features with Premium.</p>
            </div>

            <div className="space-y-6">
                {Object.values(plans).map((plan) => (
                    <Card key={plan.name} className={subscription.plan === plan.name ? 'border-primary ring-2 ring-primary shadow-lg' : ''}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {plan.name === 'Premium' && <Star className="h-6 w-6 text-yellow-400" />}
                                {plan.name}
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <p>{feature}</p>
                                 </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                             {subscription.plan === plan.name ? (
                                <Button disabled className="w-full">Current Plan</Button>
                            ) : (
                                <Button onClick={handleUpgrade} className="w-full" disabled={isLoading || plan.name === 'Free'}>
                                    {isLoading && plan.name === 'Premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {plan.name === 'Free' ? 'Current Plan' : 'Upgrade to Premium'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Card className="mt-6 text-center p-4 bg-accent/20 border-accent/30">
                <p className="text-sm text-accent-foreground/90">After successful payment, please return to the app. If your plan isn't updated, tap below.</p>
                <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="mt-3">
                    {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh Status
                </Button>
            </Card>
        </div>
    );
}
