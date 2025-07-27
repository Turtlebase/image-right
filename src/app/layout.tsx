import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { TelegramProvider } from '@/components/telegram-provider';
import Script from 'next/script';

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
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
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
        <Script async src="https://jsc.adskeeper.com/t/e/tele.min.js" strategy="lazyOnload"></Script>
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TelegramProvider>
            {children}
          </TelegramProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
