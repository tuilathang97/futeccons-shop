"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Image from 'next/image';
import { type Post, type Image as ImageType } from '@/db/schema';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { useCategories } from '@/contexts/CategoriesContext';

interface ProductCardProps {
    post: Post;
    badge?: string;
    thumbnailImg?: ImageType;
}

const ProductCard: React.FC<ProductCardProps> = ({ post, badge = "Hot", thumbnailImg }) => {
    const router = useRouter();
    const path = usePathname()
    const [isLiked, setIsLiked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [level1Ref, setLevel1Ref] = useState("");
    const { categories } = useCategories()

    useEffect(() => {
        setIsMounted(true);
        try {
            const likedPosts = localStorage.getItem('likedPosts');
            if (likedPosts) {
                const likedPostsArray = JSON.parse(likedPosts);
                setIsLiked(Array.isArray(likedPostsArray) && likedPostsArray.includes(post.id));
            }
        } catch (error) {
            console.error('Error loading liked posts:', error);
        }
    }, [post.id]);

    useEffect(() => {
        const result = categories.find(category => category.id === post.level1Category)
        if (result)
            setLevel1Ref(result?.slug || "");
    }, [categories, post.level1Category]);


    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isMounted) return;

        try {
            let likedPostsArray: number[] = [];
            const likedPosts = localStorage.getItem('likedPosts');

            if (likedPosts) {
                likedPostsArray = JSON.parse(likedPosts);
                if (!Array.isArray(likedPostsArray)) likedPostsArray = [];
            }

            if (isLiked) {
                likedPostsArray = likedPostsArray.filter(postId => postId !== post.id);
            } else {
                likedPostsArray.push(post.id);
            }

            localStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const formatPrice = () => {
        const numPrice = parseFloat(post.giaTien);
        if (isNaN(numPrice)) return "N/A";
        if (numPrice >= 1000000000) {
            return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
        } else if (numPrice >= 1000000) {
            return `${(numPrice / 1000000).toFixed(0)} triệu`;
        }
        return numPrice.toLocaleString('vi-VN') + " đ";
    };

    const formatAddress = () => {
        return (
            <div className='flex flex-wrap items-center gap-1 text-xs' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                <Link
                    className='hover:text-red-500 hover:underline'
                    href={`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}&phuong=${post.phuongCodeName}`}
                >
                    {post.phuong || 'N/A'}
                </Link>
                <Link
                    className='hover:text-red-500 hover:underline'
                    href={`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}`}
                >
                    {post.quan || 'N/A'}
                </Link>
                <Link
                    className='hover:text-red-500 hover:underline'
                    href={`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}`}
                >
                    {post.thanhPho || 'N/A'}
                </Link>
            </div>
        );
    };

    return (
        <Card onClick={() => router.push(`/post/${post.id}`)} className="min-w-full py-4 border-none shadow-none cursor-pointer bg-transparent group flex flex-col overflow-hidden">
            <div className="flex bg-transparent flex-col h-full">
                <div className="relative w-full overflow-hidden min-h-[15rem] rounded-lg">
                    {thumbnailImg?.secureUrl ? (
                        <Suspense fallback={<Skeleton className="w-full h-full rounded-lg" />}>
                            <Image
                                src={thumbnailImg.secureUrl}
                                alt={post.tieuDeBaiViet || "Property image"}
                                fill={true}
                                className="object-cover shadow-md aspect-square"
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
                    {isMounted && (
                        <Heart
                            strokeWidth={1.5}
                            size={22}
                            className={`absolute top-2 right-2 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 z-10
                            ${isLiked ? 'fill-red-500 stroke-red-600' : 'fill-white/80 stroke-gray-500 hover:fill-red-200 hover:stroke-red-400'}`}
                            onClick={toggleLike}
                        />
                    )}
                </div>

                <div className="flex flex-col flex-grow py-3 gap-1.5">
                    <div className="flex flex-wrap items-center">
                        <span className="text-lg font-bold text-red-600 group-hover:text-red-800 transition-all duration-200">{formatPrice()}</span>
                    </div>
                    <CardTitle className="text-md font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight hover:text-brand-primary transition-colors duration-200" title={post.tieuDeBaiViet || undefined}>
                        {post.tieuDeBaiViet || "Không có tiêu đề"}
                    </CardTitle>
                    <div>
                        {formatAddress()}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
