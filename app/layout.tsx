import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sugarush - Diabetic Companion',
  description: 'Track glucose, get insights, and level up your health.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans bg-bg text-text-primary`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
