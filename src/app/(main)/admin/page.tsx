
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const { setPremium, isPremium } = useSubscription();
    const { toast } = useToast();
    const router = useRouter();

    const handleUpgrade = () => {
        setPremium();
        toast({
            title: "Success!",
            description: "You have been granted premium access for 30 days.",
        });
        // Redirect to a different page to see the effect
        router.push('/'); 
    };

    return (
        <div className="p-4 animate-in fade-in-50 duration-500">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>
                        This is a hidden page for administrative actions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isPremium ? (
                        <p className="text-green-500 font-semibold">Premium status is already active.</p>
                    ) : (
                        <Button onClick={handleUpgrade}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Grant Myself Premium Access
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
