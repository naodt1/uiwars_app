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

const siteUrl = 'https://uiwars.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'UIWars — Real-time UI/UX Design Battles',
    template: '%s | UIWars',
  },
  description:
    'UIWars is a real-time multiplayer design battle game. Join a room, tackle a timed UI/UX challenge, submit your Figma link, and let the community vote on the winner.',
  keywords: [
    'UI design battle',
    'UX design game',
    'multiplayer design challenge',
    'Figma game',
    'real-time design competition',
    'design sprint game',
    'UIWars',
  ],
  authors: [{ name: 'UIWars' }],
  creator: 'UIWars',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // Canonical
  alternates: {
    canonical: siteUrl,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'UIWars',
    title: 'UIWars — Real-time UI/UX Design Battles',
    description:
      'Join a room, tackle a timed UI/UX challenge, submit your Figma link, and vote for the best design. Free, instant, no account needed.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'UIWars — Design Battle Game',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'UIWars — Real-time UI/UX Design Battles',
    description:
      'Real-time multiplayer design battles. Pick a prompt, open Figma, submit, vote. No account needed.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@uiwars',
  },

  // Favicon / icons
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased text-neo-ink bg-neo-canvas`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'UIWars',
              url: 'https://uiwars.app',
              description:
                'Real-time multiplayer UI/UX design battle game. Join rooms, complete timed Figma design challenges, and vote for the winner.',
              applicationCategory: 'GameApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Real-time multiplayer rooms',
                'Timed design challenges',
                'Figma link submission',
                'Community voting',
                'Multiple game modes',
              ],
            }),
          }}
        />
        <AuthWrapper>
          <Navbar />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
