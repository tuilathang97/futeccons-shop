import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <html lang="vi" className="h-svh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f5f7f9] min-w-full antialiased !mx-0 max-w-[80rem] !pt-[7rem] !px-4 lg:!px-8 md:!pt-[5rem] container`}
      >
        <Header user={session?.user} session={session?.session}/>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
