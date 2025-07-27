
import { MobileLayout } from '@/components/layout/mobile-layout';
import { SubscriptionProvider } from '@/hooks/useSubscription';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <MobileLayout>{children}</MobileLayout>
    </SubscriptionProvider>
  );
}
