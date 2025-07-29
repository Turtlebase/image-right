
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { TelegramProvider } from '@/components/telegram-provider';
import Script from 'next/script';
import { RewardedAdProvider } from '@/hooks/use-rewarded-ad';
import ClientRewardedAd from '@/components/shared/client-rewarded-ad';
// import MonetagAd from '@/components/shared/monetag-ad';


export const metadata: Metadata = {
  title: {
    default: 'ImageRights AI',
    template: '%s | ImageRights AI',
  },
  description: 'Your AI-powered assistant for instantly checking image copyrights. Use images with confidence.',
  keywords: ['image copyright checker', 'ai image analysis', 'copyright lookup', 'royalty free checker', 'intellectual property'],
  applicationName: 'ImageRights AI',
  appleWebApp: {
    capable: true,
    title: "ImageRights AI",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#222222' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        {/* <Script src='//libtl.com/sdk.js' data-zone='9631988' data-sdk='show_9631988' strategy="lazyOnload" data-cfasync='false'></Script> */}
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TelegramProvider>
            <RewardedAdProvider>
              {children}
              <ClientRewardedAd />
              {/* <MonetagAd /> */}
            </RewardedAdProvider>
          </TelegramProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
