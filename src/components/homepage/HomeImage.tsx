'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { IMAGE_PLACEHOLDER } from '@/constants/provinces-config'

export default function HomeImage({ 
  href = "/",
  imgUrl,
  linkClassName,
  ImgClassName 
}: { 
  href: string,
  imgUrl: string,
  linkClassName?: string,
  ImgClassName?: string 
}) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className='container overflow-hidden px-0 xl:rounded-lg'>
      <Link href={href} className={cn('w-full h-full overflow-hidden rounded-none xl:rounded-lg block relative', linkClassName)}>
        {isLoading && (
          <Skeleton className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-none xl:rounded-lg" />
        )}
        <Image 
          src={imgUrl || "/lorem.png"} 
          alt="Home Image" 
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          className={cn(
            'min-w-full shadow-lg hover:scale-105 transition-all duration-300 max-h-[400px] md:max-h-[500px] lg:max-h-[600px] h-auto object-cover',
            isLoading ? 'opacity-0 absolute' : 'opacity-100',
            ImgClassName
          )} 
          width={1000} 
          height={1000}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
          onLoad={() => setIsLoading(false)}
          priority
        />
      </Link>
    </div>
  )
}