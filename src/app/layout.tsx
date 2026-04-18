import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Navbar } from '@/components/Navbar';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'UIWars - Real-time UI/UX Design Battles',
  description: 'Join rooms, complete design challenges, and vote on the winner.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased text-neo-ink bg-neo-canvas`}>
        <AuthWrapper>
          <Navbar />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
