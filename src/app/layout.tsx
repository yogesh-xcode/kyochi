import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { AppShell } from "@/components/kyochi/AppShell";
import { resolveRole, roleNavSections } from "@/components/kyochi/data";
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
  const role = resolveRole(process.env.NEXT_PUBLIC_KYOCHI_ROLE);

  return (
    <html lang="en">
      <body className={`${manrope.className} ${manrope.variable} ${dmSerif.variable} antialiased`}>
        <AppShell role={role} navSections={roleNavSections[role]}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
