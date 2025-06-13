import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import PageContainer from '@/components/layout/page-container';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { PostHogProvider } from '@/components/layout/PostHogProvider';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <html lang="vi" className="h-svh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white min-w-full antialiased !mx-0 max-w-[80rem] !pt-[7rem] !px-4 lg:!px-8 md:!pt-[5rem] container`}
      >

          <Toaster />
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <PageContainer>
                <AdminProtectedRoute>
                  <div className='flex flex-1 flex-col space-y-2'>
                    {children}
                  </div>
                </AdminProtectedRoute>
              </PageContainer>
            </SidebarInset>
          </SidebarProvider>

      </body>
    </html>
  );
}