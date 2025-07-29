
"use client";

import { MobileLayout } from '@/components/layout/mobile-layout';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkSubscriptionStatus } = useSubscription();

  useEffect(() => {
    // Check subscription status on layout mount
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);
  
  return (
    <MobileLayout>{children}</MobileLayout>
  );
}
