
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useSubscription } from '@/hooks/useSubscription';

export default function SubscriptionSuccessPage() {
    const { width, height } = useWindowSize();
    const { setPremium } = useSubscription();

    useEffect(() => {
        // Set user as premium when they land on this page
        setPremium();
    }, [setPremium]);

    return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <Confetti width={width} height={height} recycle={false} />
            <Card className="max-w-md w-full animate-in zoom-in-90 duration-500">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-4 rounded-full w-fit">
                        <PartyPopper className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl mt-4">Payment Successful!</CardTitle>
                    <CardDescription>
                        Welcome to ImageRights AI Premium! You now have unlimited access to all features.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/">Start Scanning</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
