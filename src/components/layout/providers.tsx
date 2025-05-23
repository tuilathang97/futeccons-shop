'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { PostHogProvider } from './PostHogProvider';

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
      </ThemeProvider>
    </PostHogProvider>
  );
}