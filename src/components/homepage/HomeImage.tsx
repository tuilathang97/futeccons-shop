import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomeImage({ href = "/",imgUrl,linkClassName,ImgClassName }: { href: string,imgUrl:string,linkClassName?:string,ImgClassName?:string }) {
  return (
   <div className='container overflow-hidden rounded-none lg:rounded-lg px-0'>
     <Link href={href} className={cn('w-full h-full overflow-hidden rounded-none lg:rounded-lg',linkClassName)}>
        <Image src={imgUrl || "/lorem.png"} alt="Home Image" className={cn('min-w-full shadow-lg hover:scale-105 transition-all duration-300 max-h-[400px] md:max-h-[500px] lg:max-h-[600px] h-auto object-cover',ImgClassName)} width={1000} height={1000} />
    </Link>
   </div>
  )
}