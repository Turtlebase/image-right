
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Moon, Lock, FileText, MessageSquare, Info, Sparkles, LifeBuoy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';

interface MenuSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MenuSheet({ isOpen, onOpenChange }: MenuSheetProps) {
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const { isPremium } = useSubscription();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLinkClick = () => {
        onOpenChange(false);
    };

    if (!isMounted) {
        return null;
    }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ul className="space-y-2">
            {!isPremium && (
                <li>
                  <Button variant="default" className="w-full justify-center gap-3 p-2 h-12 text-base bg-gradient-to-r from-primary to-accent text-primary-foreground" asChild>
                    <Link href="/subscription" onClick={handleLinkClick}><Sparkles className="w-5 h-5" /> Upgrade to Premium</Link>
                  </Button>
                </li>
            )}
            <li className="flex items-center justify-between p-2 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
            </li>
            <Separator className="my-2" />
             <li>
               <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/contact" onClick={handleLinkClick}><LifeBuoy className="w-5 h-5 text-muted-foreground" /> Support</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/privacy" onClick={handleLinkClick}><Lock className="w-5 h-5 text-muted-foreground" /> Privacy Policy</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/terms" onClick={handleLinkClick}><FileText className="w-5 h-5 text-muted-foreground" /> Terms of Use</Link>
              </Button>
            </li>
            <li>
               <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/about" onClick={handleLinkClick}><Info className="w-5 h-5 text-muted-foreground" /> About App</Link>
              </Button>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
