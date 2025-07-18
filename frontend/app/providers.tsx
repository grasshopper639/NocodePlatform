'use client';

import { ThemeProvider } from 'next-themes';  // Example: For dark mode (install next-themes if needed)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
