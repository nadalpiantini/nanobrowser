import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Freejack - AI Web Agent',
  description: 'The web is yours now.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
