
import { MobileLayout } from '@/components/layout/mobile-layout';
import { SubscriptionProvider } from '@/hooks/use-subscription';

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
