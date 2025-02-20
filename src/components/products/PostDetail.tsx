import React from 'react'
import PostSectionWrapper from '@/components/postSectionWrapper'
import { postsData, RealEstateCardProps } from '@/db/Data'
import { Bed, Clock, Compass, LandPlot, Layers, MapPin, Toilet } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { MediaCarousel } from './MediaRenderer'

function PostDetail({postId}:{postId:string}) {
    const foundPost = postsData.filter(p => p.id === postId?.toString());
    return (
        <div className='flex flex-col gap-4'>
            {foundPost.map((post: RealEstateCardProps, index: number) => (
                <div key={index} className='flex flex-col gap-3'>
                    <div className='rounded-md overflow-hidden'>
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem >
                                    <MediaCarousel mediaItems={post.mediaItems} />
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>
                    <PostSectionWrapper>
                        <div className='flex flex-col gap-4'>
                            <h1 className='font-semibold text-md md:text-xl lg:text-2xl'>{post.title}</h1>
                            <div>
                                <p className='text-lg font-medium text-red-500'>{post.price}</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='flex gap-2 items-center'> <span><MapPin size={16} /></span> {post.address} </p>
                                <p className='flex gap-2 items-center'> <span><Clock size={16} /></span> {post.datePost} </p>
                            </div>
                        </div>
                    </PostSectionWrapper>
                    <PostSectionWrapper>
                        <p>{post.description}</p>
                    </PostSectionWrapper>
                    <PostSectionWrapper>
                        <div className='flex flex-col gap-4'>
                            <h2 className='font-semibold text-lg'>Thông tin cơ bản</h2>
                            <Separator className='w-full' />
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                {post.bathrooms && <p className='flex gap-2 items-center'> <span><Toilet size={16} /></span> Số phòng vệ sinh : {post.bathrooms} </p>}
                                {post.bedrooms && <p className='flex gap-2 items-center'> <span><Bed size={16} /></span> Số phòng ngủ : {post.bedrooms} </p>}
                                {post.area && <p className='flex gap-2 items-center'> <span><LandPlot size={16} /></span> Diện tích sử dụng : {post.area} </p>}
                                {post.mainDir && <p className='flex gap-2 items-center'> <span><Compass size={16} /></span> Hướng cửa chính : {post.mainDir} </p>}
                                {post.floor && <p className='flex gap-2 items-center'> <span><Layers size={16} /></span> Nằm ở tầng : {post.floor} </p>}
                                {post.kindOfEstate && <p className='flex gap-2 items-center'> <span><Toilet size={16} /></span> Loại bất động sản : {post.kindOfEstate} </p>}
                                {post.legalPaper && <p className='flex gap-2 items-center'> <span><Toilet size={16} /></span> Giấy tờ pháp lý : {post.legalPaper} </p>}
                            </div>
                        </div>
                    </PostSectionWrapper>
                </div>
            ))}
        </div>
    )
}

export default PostDetail