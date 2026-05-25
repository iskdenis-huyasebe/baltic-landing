import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Baltic Landing",
  description: "Landing pages for Baltic businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={geistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#fafafa]">
        {children}
      </body>
    </html>
  );
}
