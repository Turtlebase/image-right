import { type Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'About ImageRights AI',
    description: 'Learn more about the ImageRights AI application.',
};

export default function AboutPage() {
  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
      <Card>
        <CardHeader className="text-center">
             <div className="relative mb-6 mx-auto">
                <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full"></div>
                <div className="relative bg-primary/10 p-4 rounded-full border border-primary/20">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
              </div>
          <CardTitle>About ImageRights AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">Your AI-powered assistant for instantly checking image copyrights. Use images with confidence.</p>
            
            <div className="space-y-2 pt-4">
                <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                    <p><span className="font-semibold">Instant Analysis:</span> Upload any image and get an AI-powered copyright analysis in seconds.</p>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                    <p><span className="font-semibold">Clear Risk Levels:</span> Understand usage rights with simple, color-coded risk levels—Safe, Attribution Needed, or Copyrighted.</p>
                </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                    <p><span className="font-semibold">Local & Private:</span> Your scan history is stored securely on your device and is never uploaded to a server.</p>
                </div>
            </div>

            <p className="text-sm text-center pt-4 text-muted-foreground">Version 1.0.0</p>
            
        </CardContent>
      </Card>
    </div>
  );
}
