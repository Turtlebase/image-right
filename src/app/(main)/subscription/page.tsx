
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Star, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTelegram } from '@/components/telegram-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const premiumFeatures = [
    { text: "Unlimited Scans", icon: Sparkles },
    { text: "More Advanced AI Model", icon: Sparkles },
    { text: "Unlimited History", icon: Sparkles },
    { text: "No Ads", icon: Sparkles },
];

const STAR_PRICE = 400;

export default function SubscriptionPage() {
    const { webApp, user } = useTelegram();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handlePurchase = () => {
        if (!webApp || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'Telegram user information not available. Please try again later.' });
            return;
        }

        setIsLoading(true);

        const payload = `premium-month-${user.id}-${Date.now()}`;

        webApp.showInvoice({
            title: 'ImageRights AI Premium',
            description: 'Unlock all premium features for one month.',
            payload: payload,
            // provider_token is left empty when using Telegram Stars as the currency.
            // For real payment providers like Stripe, you would get this token from @BotFather.
            provider_token: '',
            currency: 'XTR',
            prices: [{ label: '1 Month Premium', amount: STAR_PRICE }],
        }, (status) => {
            if (status === 'paid') {
                // The webhook will handle the premium status update.
                // We can redirect to a success page for a better user experience,
                // as the app will optimistically grant premium status.
                router.push('/subscription/success');
            } else if (status === 'failed') {
                toast({ variant: 'destructive', title: 'Payment Failed', description: 'Your payment could not be processed. Please try again.' });
                 setIsLoading(false);
            } else if (status === 'cancelled') {
                 toast({ variant: 'default', title: 'Payment Cancelled', description: 'You have cancelled the payment process.' });
                 setIsLoading(false);
            }
            // For 'pending' status, we also stop loading and wait for the webhook confirmation.
            else {
                setIsLoading(false);
            }
        });
    };

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
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
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
                            <Loader2 className="animate-spin" />
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
