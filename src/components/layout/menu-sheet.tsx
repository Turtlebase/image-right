"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Moon, Lock, FileText, MessageSquare, Info, LogIn } from 'lucide-react';

interface MenuSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MenuSheet({ isOpen, onOpenChange }: MenuSheetProps) {
  // In this dark-by-default app, this toggle is for demonstration.
  // A full implementation would require a theme provider.
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

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
              <Switch id="dark-mode" defaultChecked onClick={toggleTheme} />
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base">
                <LogIn className="w-5 h-5 text-muted-foreground" />
                Login with Telegram
              </Button>
            </li>
            <Separator className="my-2" />
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Privacy Policy
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Terms of Use
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                Contact Us
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto text-base">
                <Info className="w-5 h-5 text-muted-foreground" />
                About App
              </Button>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
