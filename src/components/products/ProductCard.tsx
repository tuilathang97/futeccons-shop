"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MapPin } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Post } from '@/db/schema';

interface ProductCardProps {
    post: Post;
    variant?: "horizontal" | "vertical";
    badge?: string;
}

function LocationAnchor({location, href}:{location:string, href?:string}) {
    if(!href) {
        return <span>{location}</span>
    }
    
    const handleClick = () => {
        const params = new URLSearchParams(href)
        console.log(params)
    }
    
    return (
        <span className='cursor-pointer hover:text-red-500' onClick={handleClick}>
            {location}
        </span>
    )
}

const ProductCard: React.FC<ProductCardProps> = ({ post, variant = "vertical", badge = "Hot" }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

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
    
    const {thanhPhoCodeName, quanCodeName, phuongCodeName} = post;
    
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

    // Format price from raw number to formatted string
    const formatPrice = () => {
        const numPrice = parseFloat(post.giaTien);
        if (numPrice >= 1000000000) {
            return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
        } else if (numPrice >= 1000000) {
            return `${(numPrice / 1000000).toFixed(0)} triệu`;
        }
        return numPrice.toString();
    };

    // Format address
    const formatAddress = () => {
        return (
            <div className='flex flex-wrap items-center gap-1'>
                {post.duong && <LocationAnchor location={post.duong} />}
                {post.duong && (post.phuong || post.quan || post.thanhPho) && <span>, </span>}
                {post.phuong && <LocationAnchor location={post.phuong} href={phuongCodeName} />}
                {post.phuong && (post.quan || post.thanhPho) && <span>, </span>}
                {post.quan && <LocationAnchor location={post.quan} href={quanCodeName} />}
                {post.quan && post.thanhPho && <span>, </span>}
                {post.thanhPho && <LocationAnchor location={post.thanhPho} href={thanhPhoCodeName} />}
            </div>
        );
    };

    return (
        <Card className={`shadow-md border ${variant === "vertical" ? "h-full w-[90%]" : "w-full"} hover:shadow-lg group overflow-hidden transition-shadow duration-300`}>
            <Link href={`/post/${post.id}`} className="block h-full">
                <div className={cn(
                    "flex",
                    variant === "vertical"
                        ? "flex-col h-full"
                        : "flex-col md:flex-row md:h-full"
                )}>
                    {/* Image Container */}
                    <div className={cn(
                        "relative overflow-hidden", 
                        variant === "vertical" 
                            ? "h-[200px] w-full"
                            : "h-[200px] md:h-full md:w-[280px] flex-shrink-0"
                        )}>
                        <Image
                            src={`https://picsum.photos/200/300.jpg`}
                            fill
                            alt={post.tieuDeBaiViet || "Property image"}
                            className="object-cover"
                        />
                        <Badge className="absolute text-white bg-red-500 border border-gray-500 shadow-md top-2 left-2">
                            {badge}
                        </Badge>
                        {isMounted && (
                            <Heart
                                strokeWidth={0.5}
                                className={`absolute top-2 right-2 cursor-pointer transition-all duration-300 hover:scale-110
                                ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'}`}
                                onClick={toggleLike}
                            />
                        )}
                    </div>

                    {/* Content Container */}
                    <div className={cn(
                        "flex flex-col flex-grow",
                        variant === "vertical" ? "p-4" : "p-4"
                    )}>
                        <CardTitle className="mb-2 text-lg font-semibold group-hover:text-red-500 line-clamp-2">
                            {post.tieuDeBaiViet}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-red-600">{formatPrice()}</span>
                            <Badge variant={"outline"} className="text-sm font-medium text-gray-700">
                                {post.dienTichDat} m²
                            </Badge>
                        </div>
                        <CardDescription className="mb-3 text-sm text-gray-800 line-clamp-2">
                            {post.noiDung}
                        </CardDescription>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
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
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="flex-shrink-0 w-4 h-4"/>
                                <span className='text-xs'>{formatAddress()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default ProductCard;
