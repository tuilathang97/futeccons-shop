
import React from 'react';
import CitySidebar from './CitySidebar';
import PopularSearches from './PopularSearches';
import path from "path";
import fs from 'fs';

interface SidebarProps {
  className?: string;
}

export default async function Sidebar({ className }: SidebarProps) {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <CitySidebar provinces={provinces} />
      <PopularSearches />
    </div>
  );
} 