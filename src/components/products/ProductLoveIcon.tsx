"use client"
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function ProductLoveIcon({postId}:{postId:number}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
      setIsMounted(true);
      try {
          const likedPosts = localStorage.getItem('likedPosts');
          if (likedPosts) {
              const likedPostsArray = JSON.parse(likedPosts);
              setIsLiked(Array.isArray(likedPostsArray) && likedPostsArray.includes(postId));
          }
      } catch (error) {
          console.error('Error loading liked posts:', error);
      }
  }, [postId]);


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
        likedPostsArray = likedPostsArray.filter(postId => postId !== postId);
      } else {
        likedPostsArray.push(postId);
      }

      localStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Heart 
      strokeWidth={1.5}
      size={22}
      className={`absolute top-2 right-2 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 z-10
      ${isLiked ? 'fill-red-500 stroke-red-600' : 'fill-white/80 stroke-gray-500 hover:fill-red-200 hover:stroke-red-400'}`}
      onClick={toggleLike}
    />
  )
}