
import React from 'react';
import CitySidebar from './CitySidebar';
import PopularSearches from './PopularSearches';
import path from "path";
import fs from 'fs';

export default async function Sidebar() {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);

  return (
    <div className={`flex flex-col gap-6 md:hidden `}>
      <CitySidebar provinces={provinces} />
      <PopularSearches />
    </div>
  );
} 