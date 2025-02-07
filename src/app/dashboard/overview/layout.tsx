import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import PageContainer from '@/components/layout/page-container';
import Providers from '@/components/layout/providers';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import React from 'react';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  children,
}: {
  children: React.ReactNode;
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <Providers>
      <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <PageContainer>
              <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center justify-between space-y-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Hi, Welcome back 👋
                  </h2>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                  <div className='col-span-4'>{bar_stats}</div>
                  <div className='col-span-4 md:col-span-3'>
                    {/* sales arallel routes */}
                    {children}
                  </div>
                  <div className='col-span-4'>{area_stats}</div>
                  <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
                </div>
              </div>
            </PageContainer>
          </SidebarInset>
        </SidebarProvider>
    </Providers>
    
  );
}
