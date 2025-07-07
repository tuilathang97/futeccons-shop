'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGE_PLACEHOLDER } from '@/constants/provinces-config'

export default function HomeImage({
  href = "/",
  imgUrl,
}: {
  href: string,
  imgUrl: string,
  linkClassName?: string,
  ImgClassName?: string
}) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className='container overflow-hidden px-0 rounded-none'>
      <Link href={href} className="block relative aspect-video overflow-hidden rounded-none xl:rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-none xl:rounded-lg">
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <Image
          src={imgUrl || "/lorem.png"}
          alt="Home Image"
          fill
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          priority
          fetchPriority='high'
          quality={60}
          className="object-cover w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
          onLoad={() => setIsLoading(false)}
        />
      </Link>

    </div>
  )
}