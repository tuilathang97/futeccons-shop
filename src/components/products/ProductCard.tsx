import React, { Suspense } from 'react';
import { Badge } from "@/components/ui/badge";
import { Image as ImageType, Post } from '@/db/schema';
import { Skeleton } from '../ui/skeleton';
import ProductCardSection from './ProductCardSection';
import ProductLoveIcon from './ProductLoveIcon';
import Link from 'next/link';
import { getPostThumbnailByPostId } from '@/lib/queries';
import Image from 'next/image';

interface ProductCardProps {
    post: Post;
    badge?: string;

}

const ProductCard: React.FC<ProductCardProps> = async ({ post, badge = "Hot" }) => {
    const {image} = await getPostThumbnailByPostId(post.id)
    const thumbnailImg = image as ImageType
    return (
        <Link href={`/post/${post.id}`} className="min-w-full border-none shadow-none cursor-pointer bg-transparent group flex flex-col overflow-hidden">
            <div className="flex bg-transparent flex-col h-full">
                <div className="relative aspect-square w-full overflow-hidden min-h-[15rem] rounded-2xl">
                    {thumbnailImg?.secureUrl ? (
                        <Suspense fallback={<Skeleton className="w-full h-full rounded-2xl" />}>
                            <Image
                                src={thumbnailImg.secureUrl}
                                alt={post.tieuDeBaiViet || "Property image"}
                                fill={true}
                                className="object-cover shadow-md "
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Suspense>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                            <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                    )}
                    <Badge className="absolute top-2 left-2 text-white bg-red-500 shadow-md z-10 px-2 py-0.5 text-xs font-semibold">
                        {badge}
                    </Badge>
                    <ProductLoveIcon postId={post.id} />
                </div>
                <ProductCardSection post={post} />
            </div>
        </Link>
    );
};

export default ProductCard;
