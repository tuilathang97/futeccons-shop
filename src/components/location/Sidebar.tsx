'use client';

import React from 'react';
import CitySidebar from './CitySidebar';
import PopularSearches from './PopularSearches';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <CitySidebar />
      <PopularSearches />
    </div>
  );
} 