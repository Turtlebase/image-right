
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription, type SubscriptionPlan } from '@/hooks/useSubscription';
import { useTelegram } from '@/components/telegram-provider';
import { CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

declare const Razorpay: any;

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
        price: '₹99/mo', // Updated price for Indian audience
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
    const { subscription, setPlan, isInitialized } = useSubscription();
    const { user } = useTelegram();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = () => {
        setIsLoading(true);

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;

        if (!keyId || !planId) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Payment gateway is not configured correctly. Please contact support.',
            });
            setIsLoading(false);
            return;
        }

        const options = {
            key: keyId,
            plan_id: planId,
            quantity: 1,
            name: "ImageRights AI Premium",
            description: "Monthly Subscription",
            callback_url: `${window.location.origin}/subscription`, // Important for webview handling
            handler: function (response: any) {
                toast({
                    title: 'Subscription Successful!',
                    description: 'Welcome to Premium!',
                });
                setPlan('Premium');
                setIsLoading(false);
                router.push('/');
            },
            prefill: {
                name: user ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
            },
            notes: {
                telegram_user_id: user?.id,
            },
            theme: {
                color: "#29ABE2"
            },
            modal: {
                escape: false, // Prevents closing on escape key, crucial for webviews
                ondismiss: function() {
                    setIsLoading(false);
                }
            },
        };
        
        try {
            const rzp = new Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: 'Could not initialize the payment gateway. Please try again.',
            });
            setIsLoading(false);
        }
    }
    
    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (plan === 'Premium') {
            handleUpgrade();
        } else {
            setPlan(plan);
            toast({
                title: 'Plan Changed',
                description: 'You have been downgraded to the Free plan.',
            });
            router.push('/');
        }
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
                                <Button onClick={() => handleSelectPlan(plan.name as SubscriptionPlan)} className="w-full" disabled={isLoading}>
                                    {isLoading && plan.name === 'Premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {plan.name === 'Free' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">Payments are securely processed by Razorpay.</p>
        </div>
    );
}
