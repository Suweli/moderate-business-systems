import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Preloader from '@/components/preloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moderate Business Systems Ltd | Engineering, Procurement & Industrial Solutions',
  description: 'Premium engineering, procurement, industrial solutions, facility management and technology support company serving government, multinational and enterprise organizations.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Moderate Business Systems Ltd',
    description: 'Premium engineering, procurement, industrial solutions, facility management and technology support.',
    url: 'https://moderatebiz.com',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
