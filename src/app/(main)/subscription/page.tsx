
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Star, Sparkles, Bot } from 'lucide-react';
import Link from 'next/link';
import { useTelegram } from '@/components/telegram-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

const premiumFeatures = [
    { text: "Unlimited Scans", icon: Sparkles },
    { text: "Most Advanced AI Model", icon: Sparkles },
    { text: "AI Social Media Post Generation", icon: Bot },
    { text: "Unlimited Scan History", icon: Sparkles },
    { text: "No Ads", icon: Sparkles },
];

const STAR_PRICE = 400;

export default function SubscriptionPage() {
    const { webApp, user } = useTelegram();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isPremium, setPremium } = useSubscription();

    const handlePurchase = () => {
        if (isLoading) return;

        if (!webApp || !user) {
            toast({
                variant: 'destructive',
                title: 'Telegram Not Ready',
                description: 'Telegram user information not available. Please try again in a moment.'
            });
            return;
        }

        setIsLoading(true);

        const payload = `premium-month-${user.id}-${Date.now()}`;

        try {
            // As per Telegram's documentation for paying with Stars (XTR currency),
            // the `provider_token` field MUST NOT be included in the request.
            webApp.showInvoice({
                title: 'ImageRights AI Premium',
                description: 'Unlock all premium features for one month.',
                payload: payload,
                currency: 'XTR',
                prices: [{ label: '1 Month Premium', amount: STAR_PRICE }],
            }, (status) => {
                setIsLoading(false); // Reset loading state regardless of outcome
                
                if (status === 'paid') {
                    // Optimistically set premium and redirect.
                    // The webhook will provide the official server-side confirmation.
                    setPremium();
                    router.push('/subscription/success');
                } else if (status === 'failed') {
                    toast({ variant: 'destructive', title: 'Payment Failed', description: 'Your payment could not be processed. Please try again.' });
                }
                // 'cancelled' or other statuses do not need a specific toast message.
            });
        } catch (error) {
            setIsLoading(false);
            console.error("Error showing invoice:", error);
            toast({
                variant: 'destructive',
                title: 'An Error Occurred',
                description: 'Could not initiate the payment process. Please try again later.'
            });
        }
    };

    if (isPremium) {
        return (
            <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                <Card className="max-w-md w-full animate-in zoom-in-90 duration-500">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 p-4 rounded-full w-fit">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl mt-4">You are a Premium User</CardTitle>
                        <CardDescription>
                            You already have unlimited access to all features. Thank you for your support!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 animate-in fade-in-50 duration-500">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
            <Card className="shadow-lg shadow-primary/10 border-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 text-primary">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-2">Go Premium</CardTitle>
                    <CardDescription className="max-w-md mx-auto">
                        Unlock all features and get the best experience with ImageRights AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="space-y-3">
                        {premiumFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <feature.icon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-foreground">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        size="lg" 
                        className="w-full rounded-full text-lg h-14 font-bold" 
                        onClick={handlePurchase}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Bot className="animate-spin" />
                        ) : (
                            <>
                                Upgrade for {STAR_PRICE} <Star className="ml-2 fill-yellow-400 text-yellow-400" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
