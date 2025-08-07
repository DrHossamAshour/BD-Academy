import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import AuthProvider from "./providers/AuthProvider";

export const metadata: Metadata = {
  title: "BigDentist Academy - Professional Dental Education Platform",
  description: "Master dentistry with our comprehensive online courses, expert instructors, and certification programs. Join thousands of dental professionals advancing their careers.",
  keywords: ["dentistry education", "dental courses", "dental training", "dental certification", "dental academy", "online learning"],
  authors: [{ name: "BigDentist Academy" }],
  creator: "BigDentist Academy",
  publisher: "BigDentist Academy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://bigdentist.academy'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'BigDentist Academy - Professional Dental Education Platform',
    description: 'Master dentistry with our comprehensive online courses, expert instructors, and certification programs.',
    siteName: 'BigDentist Academy',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BigDentist Academy - Professional Dental Education'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigDentist Academy - Professional Dental Education Platform',
    description: 'Master dentistry with our comprehensive online courses, expert instructors, and certification programs.',
    images: ['/images/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d8bf78' },
    { media: '(prefers-color-scheme: dark)', color: '#d8bf78' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans">
        <AuthProvider>
          <ClientBody>{children}</ClientBody>
        </AuthProvider>
      </body>
    </html>
  );
}
