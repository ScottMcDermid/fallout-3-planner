import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Fallout 3 Planner',
  description:
    'Optimize your Fallout 3 character from start to finish. Plan S.P.E.C.I.A.L. stats, skills, and perks to avoid inefficiencies and conquer the Capital Wasteland.',
  openGraph: {
    title: 'Fallout 3 Planner',
    description:
      'Optimize your Fallout 3 character from start to finish. Plan S.P.E.C.I.A.L. stats, skills, and perks to avoid inefficiencies and conquer the Capital Wasteland.',
    url: 'https://plan.fallout3.tools',
    siteName: 'Fallout 3 Planner',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fallout 3 Planner',
    description:
      'Optimize your Fallout 3 character from start to finish. Plan S.P.E.C.I.A.L. stats, skills, and perks to avoid inefficiencies and conquer the Capital Wasteland.',
  },
  alternates: {
    canonical: 'https://plan.fallout3.tools',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1a1e1b',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
