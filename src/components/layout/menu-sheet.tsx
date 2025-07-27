"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Moon, Lock, FileText, MessageSquare, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MenuSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MenuSheet({ isOpen, onOpenChange }: MenuSheetProps) {
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                <Link href="/privacy"><Lock className="w-5 h-5 text-muted-foreground" /> Privacy Policy</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/terms"><FileText className="w-5 h-5 text-muted-foreground" /> Terms of Use</Link>
              </Button>
            </li>
            <li>
               <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/contact"><MessageSquare className="w-5 h-5 text-muted-foreground" /> Contact Us</Link>
              </Button>
            </li>
            <li>
               <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base" asChild>
                <Link href="/about"><Info className="w-5 h-5 text-muted-foreground" /> About App</Link>
              </Button>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
