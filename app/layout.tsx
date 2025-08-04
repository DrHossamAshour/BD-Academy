import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import AuthProvider from "./providers/AuthProvider";

export const metadata: Metadata = {
  title: "BigDentist - Dental Education Platform",
  description: "Professional dental education and training platform",
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
