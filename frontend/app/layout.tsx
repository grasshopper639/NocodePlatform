import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // Global styles (create this file if missing)
import { Providers } from './providers';  // Import your client-side providers

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'No-Code Platform',
  description: 'Build apps with AI-powered no-code tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
