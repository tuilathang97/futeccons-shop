import React, { Suspense } from 'react'
import path from "path";
import fs from 'fs';
import FilteredProvinces from '@/components/filterComponent/FilteredProvinces';

async function ProductsListWithFilter() {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);
  return (
    <div>
      <div className='flex items-center'>
        <Suspense fallback={<div>Đang tải...</div>}>
          <FilteredProvinces provinces={provinces} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductsListWithFilter