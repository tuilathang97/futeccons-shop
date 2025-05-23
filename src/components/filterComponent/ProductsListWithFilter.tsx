import React, { Suspense } from 'react'

import FilteredProvinces from '@/components/filterComponent/FilteredProvinces';
import rawProvincesData from '@/constants/vietnamese-provinces.json'; 
import type { Province, District, Ward } from 'types'; 

interface RawWard {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

interface RawDistrict {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: RawWard[];
}

interface RawProvince {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: RawDistrict[];
}

// Function to transform the raw data to match the expected types
function transformProvincesData(rawData: RawProvince[]): Province[] {
  return rawData.map((province: RawProvince): Province => ({
    ...province,
    districts: province.districts.map((district: RawDistrict): District => ({
      ...district,
      province_code: province.code,
      wards: district.wards.map((ward: RawWard): Ward => ({
        ...ward,
        district_code: district.code,
      })),
    })),
  }));
}

const provinces: Province[] = transformProvincesData(rawProvincesData as RawProvince[]);

function ProductsListWithFilter() {

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