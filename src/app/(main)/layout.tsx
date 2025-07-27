
import { MobileLayout } from '@/components/layout/mobile-layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileLayout>{children}</MobileLayout>
  );
}
