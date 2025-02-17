import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futeccons Shop",
  description: "Mua bán bất động sản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-svh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !pt-[7rem] !px-4 lg:!px-8 md:!pt-[5rem] container`}
      >
        <Header/>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
