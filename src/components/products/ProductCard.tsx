"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MapPin } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RealEstateCardProps } from '@/constants/data';


const ProductCard: React.FC<RealEstateCardProps> = ({
    title,
    address,
    id,
    description,
    price,
    area,
    bedrooms,
    bathrooms,
    mediaItems,
    datePost,
    variant="vertical",
    badge="Tin thường"
}) => {
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
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
        e.preventDefault()

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
    return (
        <Link href={`/post/${id}`} className={`${variant !== "horizontal" ? "min-h-[15rem] border-gray-300 max-w-[20rem]" : "w-full border-gray-200"} block max-h-fit group border  rounded-lg hover:shadow-lg overflow-hidden`}>
            <Card className={`w-full shadow-md ${variant !== "horizontal" ? "flex flex-col" : "flex flex-col md:flex-row"} gap-2 `}>
                <CardHeader className="p-0">
                    <div className={cn("relative",variant === "vertical" ? "p-0" : "p-4")}>
                        <Image
                            src={mediaItems[0].url ? mediaItems[0].url : "https://picsum.photos/200/300.jpg"}
                            height={250}
                            width={250}
                            alt={title}
                            className={cn("w-full h-48 object-cover", variant === "vertical" ? "" : "rounded-md")}
                        />
                        <Badge className={cn("absolute top-2 left-2 bg-red-500 text-white",variant === "vertical" ? "top-2 left-2" : "top-6 left-6")}>
                            {badge}
                        </Badge>
                        <Heart
                            strokeWidth={0.5}
                            className={`absolute ${variant === "vertical" ? "top-2 right-2" : "top-6 right-6"} cursor-pointer transition-all duration-300 hover:scale-110
                                ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'}`}
                            onClick={toggleLike}
                        />
                    </div>
                </CardHeader>
                <div>
                <CardContent>
                    <CardTitle className="text-lg group-hover:text-red-500 font-semibold">{title}</CardTitle>
                    <CardDescription className="text-gray-500 text-xs line-clamp-2">{description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{area}</Badge>
                        <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{bedrooms} PN</Badge>
                        <Badge variant={"outline"} className="text-sm text-gray-700 font-medium">{bathrooms} WC</Badge>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 px-4 pb-4">
                    <span className="text-lg font-bold text-red-600">{price}</span>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{datePost}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{address}</span>
                    </div>
                </CardFooter>
                </div>
            </Card>
        </Link>
    );
};

export default ProductCard;



