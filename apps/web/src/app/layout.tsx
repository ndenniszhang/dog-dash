import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '../theme/ThemeProvider';
import { AppQueryClientProvider } from '@/lib/queryClient';
import { AppNav } from '@/components/layout/AppNav';

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dog Dash — Find Trusted Dog Walkers',
  description: 'Connect with vetted dog walkers in your neighborhood.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider>
          <body className={`${inter.variable} antialiased bg-gray-50 min-h-screen`}>
            <AppQueryClientProvider>
              <AppNav />
              <main className="container mx-auto px-4 py-6 max-w-5xl">
                {children}
              </main>
            </AppQueryClientProvider>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
