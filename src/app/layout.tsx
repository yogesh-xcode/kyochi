import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { DashboardHeader } from "@/components/kyochi/DashboardHeader";
import { navSections } from "@/components/kyochi/data";
import { Sidebar } from "@/components/kyochi/Sidebar";
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} ${dmSerif.variable} antialiased`}>
        <div className="flex min-h-screen overflow-hidden bg-[#f8f7f6] text-slate-900">
          <Sidebar navSections={navSections} />
          <main className="ml-72 flex-1 p-8 space-y-8 bg-[#f8f7f6] min-h-screen">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
