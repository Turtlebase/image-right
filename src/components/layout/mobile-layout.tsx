
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, FileText, Compass, Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MenuSheet } from './menu-sheet';
import UserProfile from './user-profile';
import { useTelegram } from '../telegram-provider';
import { useSubscription } from '@/hooks/useSubscription';
import { Star } from 'lucide-react';
import AppLogo from '../shared/logo';
import AdsterraBanner from '../ads/adsterra-banner';

// This function will be defined globally by the Monetag script
declare function show_9631988(options?: any): Promise<void>;


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/scan', label: 'Scan', icon: Scan },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/guide', label: 'Guide', icon: Compass },
];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useTelegram();
  const { subscription } = useSubscription();

  React.useEffect(() => {
    // Only show pop-up style ads for free users
    if (subscription.plan !== 'Free') {
      return;
    }

    let adCount = 0;
    const maxAdsPerSession = 10;
    let initialTimer: NodeJS.Timeout | null = null;
    let subsequentInterval: NodeJS.Timeout | null = null;

    const showMonetagInApp = () => {
      if (adCount >= maxAdsPerSession) {
        if (subsequentInterval) clearInterval(subsequentInterval);
        return;
      }
      if (typeof show_9631988 === 'function') {
        show_9631988()
          .then(() => {
            adCount++;
          })
          .catch((err: any) => console.error("Monetag in-app ad error:", err));
      }
    };

    // Show the first ad after 30 seconds
    initialTimer = setTimeout(() => {
        showMonetagInApp();
        // After the first ad, start the recurring 5-minute interval
        subsequentInterval = setInterval(showMonetagInApp, 5 * 60 * 1000); // 5 minutes
    }, 30 * 1000); // 30 seconds


    // Cleanup timers when the component unmounts or subscription plan changes
    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (subsequentInterval) clearInterval(subsequentInterval);
    };

  }, [subscription.plan]);

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
             <Link href="/" className="flex items-center gap-2">
                <AppLogo className="h-8 w-8" />
                <h1 className="text-xl font-bold">ImageRights AI</h1>
            </Link>
            {subscription.plan === 'Premium' && (
                <Link href="/subscription">
                    <Star className="h-5 w-5 text-yellow-400" />
                </Link>
            )}
          </div>
          {user && <UserProfile user={user} />}
      </header>

      <main className="flex-1 overflow-y-auto pt-4 pb-[140px]">{children}</main>

      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto flex justify-center px-4">
        <AdsterraBanner />
      </div>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 px-4 pb-4">
        <div className="bg-background/80 backdrop-blur-lg border border-border rounded-2xl flex items-center justify-around h-full shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-muted-foreground transition-colors duration-200 w-16',
                pathname === item.href ? 'text-primary' : 'hover:text-foreground'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 w-16"
          >
            <MenuIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </footer>
      <MenuSheet isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </div>
  );
}
