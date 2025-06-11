import path from 'path';
import React from 'react'
import fs from 'fs';
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import PageWrapper from '../PageWrapper'
import Link from 'next/link'

// Interface cho dữ liệu tỉnh thành
interface Province {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
}

interface ProvincesCardProps {
  className?: string
}

function ProvincesRender(provinces: Province[], imagesUrl: string[]) {
  const renderProvinces = provinces.map((province, index) => {
    return (
      <Link
        href={`/ban-nha/${province.codename}`}
        key={province.code}
        className="group hover:shadow-lg min-w-full min-h-full flex flex-col items-center gap-2 rounded-md transition-colors hover:bg-slate-50"
      >
        <div className='relative min-w-full hover:shadow-md transition-shadow duration-300'>
          <div className="flex flex-col-reverse items-center gap-2">
            <Image 
              className='z-10 object-cover brightness-50 hover:brightness-100 transition-all duration-300 min-w-full min-h-full w-[10rem] h-[10rem] rounded-md' 
              src={imagesUrl[index] || imagesUrl[0]} 
              alt={province.name} 
              width={200} 
              height={200} 
            />
          </div>
          <p className="text-2xl flex justify-center w-full text-center text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 font-bold">
            {province.name.replace('Tỉnh ', '').replace('Thành phố ', '')}
          </p>
        </div>
      </Link>
    )
  })
  return renderProvinces
}

export default async function ProvincesCard({ className }: ProvincesCardProps) {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const allProvinces: Province[] = JSON.parse(jsonData);
  const provinces = allProvinces.slice(0, 10);
  
  const imagesUrl = [
    "/categoryImages/ban-nha-dat.webp", // Placeholder cho Hà Nội
    "/categoryImages/cho-thue.webp", // Placeholder cho Hà Giang
    "/categoryImages/du-an.webp", // Placeholder cho Cao Bằng
    "/categoryImages/bietThuChoThue.webp", // Placeholder
    "/categoryImages/chungCu.webp", // Placeholder
    "/categoryImages/nhaPho.webp", // Placeholder
    "/categoryImages/ban-nha-dat.webp", // Placeholder
    "/categoryImages/cho-thue.webp", // Placeholder
    "/categoryImages/du-an.webp", // Placeholder
    "/categoryImages/bietThuChoThue.webp", // Placeholder
  ]
  
  return (
    <PageWrapper className='px-0 py-4 bg-none flex flex-col gap-4'>
      <h2 className='text-2xl font-bold font-montserrat '>Browse by location</h2>
      <Card className={cn("p-0 bg-transparent hover:shadow-md transition-shadow duration-300 border-none shadow-none", className)}>
        <CardContent className='p-0 gap-4 min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {ProvincesRender(provinces, imagesUrl)}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}