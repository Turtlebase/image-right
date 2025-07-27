
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription, type SubscriptionPlan } from '@/hooks/useSubscription.tsx';
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
    const { subscription, setPlan } = useSubscription();
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
            subscription_id: planId, // For subscription-based checkout
            name: "ImageRights AI Premium",
            description: "Monthly Subscription",
            handler: function (response: any) {
                // This function is called on successful payment.
                // In a real app, you would send response.razorpay_payment_id
                // to your backend for verification and activation.
                // For now, we simulate the upgrade on the client-side.
                toast({
                    title: 'Subscription Successful!',
                    description: 'Welcome to Premium!',
                });
                setPlan('Premium');
                router.push('/');
            },
            prefill: {
                name: user ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
                // email: user.email, // If you have user's email
                // contact: user.phone_number, // If you have user's phone
            },
            notes: {
                telegram_user_id: user?.id,
            },
            theme: {
                color: "#29ABE2" // Vibrant blue from your style guide
            },
            modal: {
                ondismiss: function() {
                    setIsLoading(false);
                }
            }
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
            // handleUpgrade(); // Temporarily disabled
            toast({
                title: 'Coming Soon!',
                description: 'Premium subscriptions will be available after our store review is complete.',
            });
        } else {
            // Logic for downgrading
            setPlan(plan);
            toast({
                title: 'Plan Changed',
                description: 'You have been downgraded to the Free plan.',
            });
            router.push('/');
        }
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
                            ) : plan.name === 'Premium' ? (
                                <Button disabled className="w-full">Coming Soon</Button>
                            ) : (
                                <Button onClick={() => handleSelectPlan(plan.name as SubscriptionPlan)} className="w-full">
                                    Downgrade to Free
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
