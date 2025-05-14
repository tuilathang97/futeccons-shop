import React from 'react'
import { Button } from '../ui/button'
import { ArrowDown, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Post } from '@/db/schema'
import { getPostImageyById } from '@/lib/queries/postImagesQueries'

interface Container {
    title: string
    posts?:Post[]
}

function ProductsContainer({ title,posts }: Container) {
    return (
        <div className='min-h-[5rem] flex flex-col bg-white container gap-4 w-full border border-gray-100 rounded-md p-4'>
            <div className='flex justify-center'>
                <h1 className='text-xl font-semibold md:text-2xl'>{title}</h1>
            </div>
            <div className='
                grid gap-4
                md:grid-cols-3
                lg:grid-cols-4
                grid-cols-1
                sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
                place-items-center
                justify-items-center
                items-start
                w-full
                max-w-[1200px]
                mx-auto'
            >
                {posts?.map(async (postData,index) => {
                    const thumbnailImg = await getPostImageyById(postData.id,true)
                    return (
                        <ProductCard thumbnailImg={thumbnailImg} variant="vertical" post={postData} key={index} />
                    )
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