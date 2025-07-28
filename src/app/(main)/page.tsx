import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-in fade-in-50 duration-500">
      <div className="relative mb-6">
        <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full"></div>
        <div className="relative bg-primary/10 p-6 rounded-full border border-primary/20">
            <ShieldCheck className="h-20 w-20 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">
        ImageRights AI
      </h1>
      <p className="mt-4 text-lg max-w-md text-muted-foreground">
        Your AI-powered assistant for instantly checking image copyrights. Use images with confidence.
      </p>
      
      <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
        <Link href="/scan" passHref>
          <Button
            size="lg"
            className="rounded-full text-lg h-14 font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Start Scanning
          </Button>
        </Link>
        <Link href="/guide" passHref>
          <Button asChild variant="ghost" size="lg" className="rounded-full text-lg h-14">
            View Guide
          </Button>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground mt-16">
        Fast, simple, and built for creators.
      </p>
    </div>
  );
}
