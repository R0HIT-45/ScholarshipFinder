import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ClientShell from "./client-shell";
import PremiumToastContainer from "@/app/components/PremiumToastContainer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "EduEquity Scholarships",
  description: "Bridging the gap in education financing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors antialiased`}>
        <ClientShell>{children}</ClientShell>
        <PremiumToastContainer />
      </body>
    </html>
  );
}