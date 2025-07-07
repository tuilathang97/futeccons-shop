import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Image as ImageType, Post } from '@/db/schema';
import ProductCardSection from './ProductCardSection';
import ProductLoveIcon from './ProductLoveIcon';
import Link from 'next/link';
import { getPostThumbnailByPostId } from '@/lib/queries';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/constants/provinces-config';

interface ProductCardProps {
    post: Post;
    badge?: string;

}

const ProductCard: React.FC<ProductCardProps> = async ({ post, badge = "Hot" }) => {
    const {image,blurDataURL} = await getPostThumbnailByPostId(post.id)

    const thumbnailImg = image as ImageType
    return (
        <div className="min-w-full border-none shadow-none bg-transparent group flex flex-col overflow-hidden">
            <div className="flex bg-transparent flex-col h-full">
                <Link href={`/post/${post.id}`} className="relative aspect-16/9 w-full overflow-hidden min-h-[15rem] rounded-2xl">
                    {thumbnailImg?.secureUrl ? (
                        <Image
                            src={thumbnailImg.secureUrl}
                            alt={post.tieuDeBaiViet || "Property image"}
                            fill={true}
                            placeholder='blur'
                            blurDataURL={blurDataURL || IMAGE_PLACEHOLDER}
                            priority={true}
                            className="object-cover shadow-md "
                            sizes="(max-width: 350px) 100vw,(max-width: 640px) 100vw,(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-lg">
                            <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                    )}
                    <Badge className="absolute top-2 left-2 text-white bg-brand-medium shadow-md z-10 px-2 py-0.5 text-xs font-semibold">
                        {badge}
                    </Badge>
                    <ProductLoveIcon postId={post.id} />
                </Link>
                <ProductCardSection post={post} />
            </div>
        </div>
    );
};

export default ProductCard;
