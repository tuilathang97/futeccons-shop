import React from 'react'
import { Button } from '../ui/button'
import { ArrowDown, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { postsData, RealEstateCardProps } from '@/db/Data'

interface Container {
    title: string
    posts?:RealEstateCardProps[]
}

function ProductsContainer({ title,posts }: Container) {
    return (
        <div className='min-h-[5rem] flex flex-col gap-4 w-full max-w-[100rem] bg-gray-50 border border-gray-50 rounded-md p-4'>
            <div className='flex justify-center'>
                <h1 className='text-xl md:text-2xl font-semibold'>{title}</h1>
            </div>
            <div className='
                grid gap-4
                grid-cols-1
                sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
                place-items-center
                justify-items-center
                items-start
                w-full
                max-w-[1200px]
                mx-auto'
            >
                {postsData.map((post,index) => {
                    const productWithFilter = post.mediaItems.filter((post) => post.type === "image")
                    if(productWithFilter.length > 0){
                        return (
                            <ProductCard key={index} {...post} />
                        )
                    }
                })}
            </div>
            <div className='flex justify-center'>
                <Button className='max-w-[15rem]'>
                    {posts?.length && posts.length  < 100 ?
                        <span className='flex items-center gap-4'>Xem thêm <ArrowDown /></span> :
                        <span className='flex items-center gap-4'>Xem thêm {posts?.length} tin <ArrowRight size={150} /></span>
                    }
                </Button>
            </div>
        </div>
    )
}

export default ProductsContainer