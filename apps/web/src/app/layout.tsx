import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Help & Heal — Instant Mental Health Support',
  description:
    'Talk to someone who cares. Connect with trained listeners, counselors, and psychologists instantly — affordable, private, and on your terms.',
  keywords: [
    'mental health',
    'counseling',
    'therapy',
    'India',
    'online counseling',
    'emotional support',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
