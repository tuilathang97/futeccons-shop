import path from 'path';
import React from 'react'
import fs from 'fs';
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import PageWrapper from '../PageWrapper'
import Link from 'next/link'
import { POPULAR_PROVINCES, PROVINCE_IMAGES, IMAGE_PLACEHOLDER } from '@/constants/provinces-config'

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
  return provinces.map((province, index) => (
    <Link
      href={`/ban-nha?thanhPho=${province.codename}`}
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
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_PLACEHOLDER}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        </div>
        <p className="text-2xl flex justify-center w-full text-center text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 font-bold drop-shadow-lg">
          {province.name.replace('Tỉnh ', '').replace('Thành phố ', '')}
        </p>
      </div>
    </Link>
  ));
}

export default async function ProvincesCard({ className }: ProvincesCardProps) {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const allProvinces: Province[] = JSON.parse(jsonData);
  const filteredProvinces = allProvinces.filter(province => POPULAR_PROVINCES.includes(province.name));

  return (
    <PageWrapper className='container px-0 py-4 bg-none flex flex-col gap-4'>
      <h2 className='text-2xl font-bold font-montserrat'>Tìm kiếm theo vị trí</h2>
      <Card className={cn("p-0 bg-transparent border-none shadow-none", className)}>
        <CardContent className='p-0 gap-4 min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {ProvincesRender(filteredProvinces, PROVINCE_IMAGES)}
          <Link
            href={`/tim-kiem-theo-tu-khoa/`}
            className="group col-span-2 hover:shadow-lg min-w-full min-h-full flex flex-col items-center gap-2 rounded-md transition-colors hover:bg-slate-50"
          >
            <div className='relative min-w-full hover:shadow-md transition-shadow duration-300'>
              <div className="flex flex-col-reverse items-center gap-2">
                <Image
                  className='z-10 object-cover brightness-50 hover:brightness-100 transition-all duration-300 min-w-full min-h-full w-[10rem] h-[10rem] rounded-md'
                  src={"/images/backgroundImage.webp"}
                  alt={"background"}
                  width={200}
                  height={200}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_PLACEHOLDER}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-2xl flex justify-center w-full text-center text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 font-bold drop-shadow-lg">
                Tỉnh/Thành phố khác
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}