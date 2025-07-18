import React from 'react'
import PostSectionWrapper from '@/components/postSectionWrapper'
import { Bed, Clock, LandPlot, Layers, MapPin, Toilet, Home, BuildingIcon, Grid2X2, Milestone, SeparatorHorizontal, SeparatorVertical } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Image as ImageType, Post, Article } from '@/db/schema'
import LocationMapServer from './LocationMapServer'
import { getPublishedArticleByParams } from '@/actions/articleActions'
import ArticleContent from '../articles/ArticleContent'
import PostCarousel from '../carousel/PostCarousel'
import PostDetailClientActions from './PostDetailClientActions'

interface PostDetailProps {
    post: Post & {
        mediaItems?: { url: string, type: string }[] | string;
        createdAt?: Date | string;
        latitude?: number | string | null | undefined;
        longitude?: number | string | null | undefined;
    }
    images: ImageType[]
    article?: Article | null
    fetchArticle?: boolean
}

async function PostDetail({ post, images, article: initialArticle, fetchArticle = true }: PostDetailProps) {
    const { giaTien, duong, phuong, quan, thanhPho, createdAt,id } = post;
    const article = (!initialArticle && fetchArticle) 
        ? await getPublishedArticleByParams({
            level1Slug: post.level1Category.toString()
        })
        : initialArticle;

    const formatPrice = () => {
        const numPrice = parseInt(giaTien.toString());
        if (numPrice >= 1000000000) {
            return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
        } else if (numPrice >= 1000000) {
            return `${(numPrice / 1000000).toFixed(0)} triệu`;
        }
        return numPrice.toString();
    };

    // Format address
    const formatAddress = () => {
        return `${duong}, ${phuong}, ${quan}, ${thanhPho}`;
    };

    const formatDate = () => {
        if (!createdAt) return "";
        const date = new Date(createdAt);
        return date.toLocaleDateString('vi-VN');
    };

    const parsedLatitude = typeof post.latitude === 'string' ? parseFloat(post.latitude) : post.latitude;
    const parsedLongitude = typeof post.longitude === 'string' ? parseFloat(post.longitude) : post.longitude;

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-3'>
                    <div className='bg-gray-200/50 border flex justify-center items-center border-gray-200 rounded-md rounded-md p-0 max-h-[1000px] overflow-hidden min-w-full'>
                        <PostCarousel images={images}/>
                    </div>
                    <PostSectionWrapper>
                        <div className='flex flex-col gap-4'>
                            <h1 className='font-bold text-md md:text-xl lg:text-2xl'>{post.tieuDeBaiViet}</h1>
                            <div>
                                <p className='text-xl font-semibold text-brand-medium '>{formatPrice()}</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='flex gap-2 items-center'> <span><MapPin size={16} /></span> {formatAddress()} </p>
                                <p className='flex gap-2 items-center'> 
                                    <span className='flex gap-2 items-center'>
                                        <Clock size={16} />
                                        Được đăng vào ngày : 
                                        <span >{formatDate()}</span>
                                    </span> 
                                </p>
                            </div>
                        </div>
                    </PostSectionWrapper>
                    <PostSectionWrapper className='font-monserrat'>
                        <p>{post.noiDung}</p>
                    </PostSectionWrapper>
                    <PostSectionWrapper>
                        <div className='flex flex-col gap-4'>
                            <h2 className='font-semibold text-lg'>Thông tin cơ bản</h2>
                            <Separator className='w-full' />
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <p className='flex font-normal gap-2 items-center'> <span><LandPlot size={20} /></span> Diện tích đất: {post.dienTichDat} m² </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><Grid2X2 size={20} /></span> Diện tích sử dụng: {post.dienTichSuDung} m² </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><SeparatorVertical size={20} /></span> Chiều ngang: {post.chieuNgang} m </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><SeparatorHorizontal size={20} /></span> Chiều dài: {post.chieuDai} m </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><Home size={20} /></span> Loại hình nhà ở: {post.loaiHinhNhaO} </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><BuildingIcon size={20} /></span> Giấy tờ pháp lý: {post.giayToPhapLy} </p>
                                <p className='flex font-normal gap-2 items-center'> <span><Toilet size={20} /></span> Số phòng vệ sinh: {post.soPhongVeSinh} </p>
                                <p className='flex font-normal gap-2 items-center'> <span><Bed size={20} /></span> Số phòng ngủ: {post.soPhongNgu} </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><Milestone size={20} /></span> Hướng cửa chính: {post.huongCuaChinh} </p>
                                <p className='flex  font-normal gap-2 items-center'> <span><Layers size={20} /></span> Số tầng: {post.soTang} </p>
                            </div>
                        </div>
                    </PostSectionWrapper>
                    <PostSectionWrapper>
                        <div className='flex flex-col gap-4'>
                            <h2 className='font-semibold text-lg'>Vị trí bất động sản</h2>
                            <Separator className='w-full' />
                            <LocationMapServer 
                                latitude={parsedLatitude} 
                                longitude={parsedLongitude} 
                                popupText={post.tieuDeBaiViet}
                            />
                        </div>
                    </PostSectionWrapper>
                    <PostSectionWrapper className='flex flex-col  gap-2'>
                        <h2 className='font-semibold text-lg'>Chức năng khác</h2>
                        <PostDetailClientActions postId={id} />
                    </PostSectionWrapper>
                </div>
            </div>
            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </div>
    )
}

export default PostDetail
