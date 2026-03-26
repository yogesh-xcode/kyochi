import type { Metadata } from "next";
// import { Manrope } from "next/font/google";

import { AppShell } from "@/components/kyochi/AppShell";
import "./globals.css";

// Temporarily disabled due to build environment network restrictions
/*
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
*/

export const metadata: Metadata = {
  title: "Kyochi Admin Dashboard",
  description: "Frontdesk and admin operations dashboard for Kyochi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Manrope Font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="antialiased"
        style={{ 
          // Fallback fonts if Google Fonts can't be loaded during build
          "--font-manrope": "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          "--font-display": "'Manrope', system-ui, sans-serif"
        } as React.CSSProperties}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
