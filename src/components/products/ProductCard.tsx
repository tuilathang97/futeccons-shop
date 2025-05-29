"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MapPin } from "lucide-react";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Post } from '@/db/schema';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Image as ImageType } from '@/db/schema';
import { useCategories } from '@/contexts/CategoriesContext';
interface ProductCardProps {
    post: Post;
    variant?: "horizontal" | "vertical";
    badge?: string;
    thumbnailImg?: ImageType;
}

const ProductCard: React.FC<ProductCardProps> = ({ post, variant = "vertical", badge = "Hot", thumbnailImg }) => {
    const path = usePathname()
    const [isLiked, setIsLiked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [level1Ref, setLevel1Ref] = useState("");
    const router = useRouter();
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
        if(result)
        setLevel1Ref(result?.slug || "");
    }, [post.level1Category]);


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
        if (numPrice >= 1000000000) {
            return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
        } else if (numPrice >= 1000000) {
            return `${(numPrice / 1000000).toFixed(0)} triệu`;
        }
        return numPrice.toString();
    };

    function handleRedirectToPost(postId: number) {
        router.push(`/post/${postId}`);
    }
    const formatAddress = () => {
        return (
            <div className='flex flex-wrap items-center gap-1' onClick={(e) => { e.stopPropagation(); }}>
                <Link
                    className='hover:text-red-500'
                    href={`${path !== "/" && path !== "/account" ? path : level1Ref}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}&phuong=${post.phuongCodeName}`}
                >
                    {post.phuong}
                </Link>
                <Link
                    className='hover:text-red-500'
                    href={`${path !== "/" && path !== "/account" ? path : level1Ref}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}`}
                >
                    {post.quan}
                </Link>
                <Link
                    className='hover:text-red-500'
                    href={`${path !== "/" && path !== "/account" ? path : level1Ref}?thanhPho=${post.thanhPhoCodeName}`}
                >
                    {post.thanhPho}
                </Link>
            </div>
        );
    };

    return (
        <Card className={`shadow-xl  ${variant === "vertical" ? "h-full w-full" : "w-full md:max-h-[20rem] "} hover:shadow-lg group overflow-hidden transition-shadow duration-300`}>
            <button onClick={() => handleRedirectToPost(post.id)} className="block w-full h-full">
                <div className={cn(
                    "flex",
                    variant === "vertical"
                        ? "flex-col h-full"
                        : "flex-col md:flex-row md:h-full"
                )}>
                    <div className={cn(
                        "relative overflow-hidden",
                        variant === "vertical"
                            ? "h-[200px] w-full rounded-t-md "
                            : "h-[200px] md:min-h-full rounded-l-md md:w-[200px] flex-shrink-0 p-0 md:p-4"
                    )}>
                        {thumbnailImg?.secureUrl &&
                            <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-full" />}>
                                <Image
                                    src={thumbnailImg?.secureUrl}
                                    fill
                                    sizes='w-[300px] h-[200px]'
                                    alt={post.tieuDeBaiViet || "Property image"}
                                    className={`object-cover ${variant === "vertical" ? "rounded-t-md" : "rounded-l-md"}`}
                                />
                            </Suspense>
                        }
                        <Badge className={`absolute text-white bg-red-500 border border-gray-500 shadow-md ${variant === "vertical" ? "top-2 left-2" : "md:top-4 md:left-2 "}`}>
                            {badge}
                        </Badge>
                        {isMounted && (
                            <Heart
                                strokeWidth={0.5}
                                className={`absolute top-2 right-2 ${variant === "vertical" ? "" : "sm:top-4 sm:right-2 "} cursor-pointer transition-all duration-300 hover:scale-110
                                ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'}`}
                                onClick={toggleLike}
                            />
                        )}
                    </div>

                    <div className={cn(
                        "flex flex-col justify-around flex-grow",
                        variant === "vertical" ? "p-4" : "p-4"
                    )}>
                        <CardTitle className="flex mb-2 text-base font-semibold text-start md:text-lg group-hover:text-red-500 line-clamp-2">
                            {post.tieuDeBaiViet}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <span className="text-lg font-bold text-red-600">{formatPrice()}</span>
                        </div>
                        <CardDescription className="flex mb-3 text-base text-gray-800 text-start md:text-xs line-clamp-1">
                            {post.noiDung}
                        </CardDescription>

                        <div className={`flex flex-wrap items-center gap-2 mb-3 ${variant === "vertical" ? "" : "block md:hidden"}`}>
                            <Badge variant={"outline"} className="text-sm font-medium text-gray-700">
                                {post.dienTichDat} m²
                            </Badge>
                            <Badge variant={"outline"} className="text-sm font-medium text-gray-700">
                                {post.soPhongNgu} PN
                            </Badge>
                            <Badge variant={"outline"} className="text-sm font-medium text-gray-700">
                                {post.soPhongVeSinh} WC
                            </Badge>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{post.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div
                                className="flex items-center gap-2 text-sm text-gray-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MapPin className="flex-shrink-0 w-4 h-4" />
                                <span className='text-xs'>{formatAddress()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </Card>
    );
};

export default ProductCard;
