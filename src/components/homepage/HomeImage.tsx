'use client'

import React from 'react'
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

  return (
    <div className='container overflow-hidden px-0 rounded-none'>
      <Link href={href} className="block relative aspect-video overflow-hidden rounded-none xl:rounded-lg">
        <Image
          src={imgUrl || "/lorem.png"}
          alt="Home Image"
          fill
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          priority
          quality={60}
          className="object-cover w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
        />
      </Link>

    </div>
  )
}