"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MapPin } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Post } from '../post/postSchema';

interface ProductCardProps extends Post {
    mediaItems: { url: string, type: string }[] | string;
    badge?: string;
    variant?: "horizontal" | "vertical";
    createdAt: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    tieuDeBaiViet,
    noiDung,
    giaTien,
    dienTichDat,
    soPhongNgu,
    soPhongVeSinh,
    duong,
    phuong,
    quan,
    thanhPho,
    createdAt,
    mediaItems,
    badge = "Tin thường",
    variant = "vertical"
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Only run client-side effects after component has mounted
    useEffect(() => {
        setIsMounted(true);
        
        try {
            const likedPosts = localStorage.getItem('likedPosts');
            if (likedPosts) {
                const likedPostsArray = JSON.parse(likedPosts);
                setIsLiked(Array.isArray(likedPostsArray) && likedPostsArray.includes(id));
            }
        } catch (error) {
            console.error('Error loading liked posts:', error);
        }
    }, [id]);

    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isMounted) return;

        try {
            let likedPostsArray: string[] = [];
            const likedPosts = localStorage.getItem('likedPosts');

            if (likedPosts) {
                likedPostsArray = JSON.parse(likedPosts);
                if (!Array.isArray(likedPostsArray)) likedPostsArray = [];
            }

            if (isLiked) {
                likedPostsArray = likedPostsArray.filter(postId => postId !== id);
            } else {
                likedPostsArray.push(id);
            }

            localStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };
    // Format price from raw number to formatted string
    const formatPrice = () => {
        const numPrice = parseInt(giaTien);
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


    // Handle media items which can be string or array
    const getImageUrl = () => {
        if (typeof mediaItems === 'string') {
            return mediaItems;
        } else if (Array.isArray(mediaItems) && mediaItems.length > 0 && mediaItems[0].url) {
            return mediaItems[0].url;
        }
        return "https://picsum.photos/200/300.jpg"; // Fallback image
    };
    return (
        <Link href={`/post/${id}`} className={`${variant !== "horizontal" ? "min-h-[15rem] border-gray-300 max-w-[20rem]" : "w-full border-gray-200"} block max-h-fit group border rounded-lg hover:shadow-lg overflow-hidden`}>
            <Card className={`w-full shadow-md ${variant !== "horizontal" ? "flex flex-col" : "flex flex-col md:flex-row"} gap-2`}>
                <CardHeader className="p-0">
                    <div className={cn("relative", variant === "vertical" ? "p-0" : "p-4")}>
                        <Image
                            src={getImageUrl()}
                            height={250}
                            width={250}
                            alt={tieuDeBaiViet || "Property image"}
                            className={cn("w-full h-48 object-cover", variant === "vertical" ? "" : "rounded-md")}
                        />
                        <Badge className={cn("absolute top-2 left-2 bg-red-500 text-white", variant === "vertical" ? "top-2 left-2" : "top-6 left-6")}>
                            {badge}
                        </Badge>
                        {isMounted && (
                            <Heart
                                strokeWidth={0.5}
                                className={`absolute ${variant === "vertical" ? "top-2 right-2" : "top-6 right-6"} cursor-pointer transition-all duration-300 hover:scale-110
                                    ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'}`}
                                onClick={toggleLike}
                            />
                        )}
                    </div>
                </CardHeader>
                <div>
                    <CardContent>
                        <CardTitle className="text-lg group-hover:text-red-500 font-semibold">{tieuDeBaiViet}</CardTitle>
                        <CardDescription className="text-gray-500 text-xs line-clamp-2">{noiDung}</CardDescription>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{dienTichDat} m²</Badge>
                            <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{soPhongNgu} PN</Badge>
                            <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{soPhongVeSinh} WC</Badge>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 pb-4">
                        <span className="text-lg font-bold text-red-600">{formatPrice()}</span>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{"00:00:00"}</span>
                        </div>
                        <div className="flex items-center px-0 gap-2 text-gray-600 text-sm">
                            <MapPin size={24} className="h-4 w-4" />
                            <span className='text-xs max-w-full'>{formatAddress()}</span>
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </Link>
    );
};

export default ProductCard;
