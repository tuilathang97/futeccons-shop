import React from 'react'
import { Button } from '../ui/button'
import { ArrowDown, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Post } from '@/db/schema'

interface Container {
    title: string
    posts?:Post[]
    linkTitle?:string
}

function ProductsContainer({ title,posts,linkTitle }: Container) {
    return (
        <div className='min-h-[5rem] flex flex-col py-4 gap-4 w-full rounded-md'>
            <div className='flex'>
                <h1 className='text-xl font-semibold md:text-2xl'>{title}</h1>
            </div>
            <div className='
                grid
                gap-4
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                grid-cols-1
                items-start
                w-full'
            >
                {posts?.map((postData,index) => {
                    return (
                        <ProductCard post={postData} key={index} />
                    )
                })}
            </div>
            <div className='flex justify-center'>
                <Button className='max-w-[15rem]'>
                    {posts?.length && posts.length  < 100 ?
                        <span className='flex items-center gap-4'>Xem thêm {linkTitle} <ArrowDown /></span> :
                        <span className='flex items-center gap-4'>Xem thêm {posts?.length} tin <ArrowRight size={150} /></span>
                    }
                </Button>
            </div>
        </div>
    )
}

export default ProductsContainer