import React from 'react'
import PostSectionWrapper from '@/components/postSectionWrapper'
import { Bed, Clock, LandPlot, Layers, MapPin, Toilet, Home, BuildingIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Post } from '../post/postSchema'

interface PostDetailProps {
    post: Post & {
        mediaItems?: { url: string, type: string }[] | string;
        createdAt?: string;
    }
}

function PostDetail({ post }: PostDetailProps) {
    // Format price from raw number to formatted string
    const formatPrice = () => {
        const numPrice = parseInt(post.giaTien);
        if (numPrice >= 1000000000) {
            return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
        } else if (numPrice >= 1000000) {
            return `${(numPrice / 1000000).toFixed(0)} triệu`;
        }
        return numPrice.toString();
    };

    // Format address
    const formatAddress = () => {
        return `${post.duong}, ${post.phuong}, ${post.quan}, ${post.thanhPho}`;
    };

    // Format date to readable string
    const formatDate = () => {
        if (!post.createdAt) return "";
        const date = new Date(post.createdAt);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
                <div className='rounded-md overflow-hidden'>
                    {/* <Carousel>
                        <CarouselContent>
                            <CarouselItem>
                                <MediaCarousel mediaItems={post.mediaItems} />
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel> */}
                </div>
                <PostSectionWrapper>
                    <div className='flex flex-col gap-4'>
                        <h1 className='font-semibold text-md md:text-xl lg:text-2xl'>{post.tieuDeBaiViet}</h1>
                        <div>
                            <p className='text-lg font-medium text-red-500'>{formatPrice()}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='flex gap-2 items-center'> <span><MapPin size={16} /></span> {formatAddress()} </p>
                            <p className='flex gap-2 items-center'> <span><Clock size={16} /></span> {formatDate()} </p>
                        </div>
                    </div>
                </PostSectionWrapper>
                <PostSectionWrapper>
                    <p>{post.noiDung}</p>
                </PostSectionWrapper>
                <PostSectionWrapper>
                    <div className='flex flex-col gap-4'>
                        <h2 className='font-semibold text-lg'>Thông tin cơ bản</h2>
                        <Separator className='w-full' />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                            <p className='flex gap-2 items-center'> <span><Toilet size={16} /></span> Số phòng vệ sinh: {post.soPhongVeSinh} </p>
                            <p className='flex gap-2 items-center'> <span><Bed size={16} /></span> Số phòng ngủ: {post.soPhongNgu} </p>
                            <p className='flex gap-2 items-center'> <span><LandPlot size={16} /></span> Diện tích sử dụng: {post.dienTichDat} m² </p>
                            <p className='flex gap-2 items-center'> <span><Layers size={16} /></span> Số tầng: {post.soTang} </p>
                            <p className='flex gap-2 items-center'> <span><Home size={16} /></span> Loại hình nhà ở: {post.loaiHinhNhaO} </p>
                            <p className='flex gap-2 items-center'> <span><BuildingIcon size={16} /></span> Giấy tờ pháp lý: {post.giayToPhapLy} </p>
                        </div>
                    </div>
                </PostSectionWrapper>
            </div>
        </div>
    )
}

export default PostDetail
