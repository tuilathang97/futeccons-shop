import React, { Suspense } from 'react'
import path from "path";
import fs from 'fs';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon } from 'lucide-react';
import FilteredProvinces from '@/components/filterComponent/FilteredProvinces';

async function ProductsListWithFilter() {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);
  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-4'>
        <Button variant={"outline"}>Lọc <ArrowDownIcon/></Button>
        <Suspense fallback={<div>Đang tải...</div>}>
          <FilteredProvinces provinces={provinces} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductsListWithFilter