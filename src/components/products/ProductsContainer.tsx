import React from 'react'
import { Button } from '../ui/button'
import ProductCard from './ProductCard'
import { Post } from '@/db/schema'
import Link from 'next/link'

interface Container {
    title: string
    posts?: Post[]
    linkTitle?: string
}

function ProductsContainer({ title, posts, linkTitle }: Container) {
    if (posts?.length === 0) {
        return <div className='container min-h-[5rem] flex flex-col py-4 gap-4 w-full rounded-md px-0'>
            <div className='flex'>
                <h1 className='text-xl font-semibold md:text-2xl'>{title}</h1>
            </div>
            <div className='flex justify-center'>
                <span className='text-gray-500 text-sm'>Không có tin nào</span>
            </div>
        </div>
    }
    return (
        <div className='container min-h-[5rem] flex flex-col py-4 gap-4 w-full rounded-md px-0'>
            <div className='flex'>
                <h1 className='text-xl font-semibold md:text-2xl'>{title}</h1>
            </div>
            <div className='
                grid
                gap-12 md:gap-4
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                grid-cols-1
                items-start
                w-full'
            >
                {posts?.map((postData, index) => {
                    return (
                        <ProductCard post={postData} key={index} />
                    )
                })}
            </div>
            <div className='flex justify-center mt-4'>
                <Link href={`/tim-kiem-theo-tu-khoa`}>
                    <Button className='max-w-[15rem]'>
                        Xem thêm {linkTitle}
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ProductsContainer