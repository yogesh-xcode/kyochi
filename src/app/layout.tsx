import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { AppShell } from "@/components/kyochi/AppShell";
import { navSections } from "@/components/kyochi/data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

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
      </head>
      <body className={`${manrope.className} ${manrope.variable} ${dmSerif.variable} antialiased`}>
        <AppShell navSections={navSections}>{children}</AppShell>
      </body>
    </html>
  );
}
