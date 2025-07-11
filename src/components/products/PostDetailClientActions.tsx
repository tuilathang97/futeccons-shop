'use client';

import { Button } from '@/components/ui/button';
import { Heart, Share2, AlertTriangle, Twitter, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
} from 'next-share'
import { useToast } from '@/hooks/use-toast';

export default function PostDetailClientActions({ postId }: { postId: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

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
        likedPostsArray = likedPostsArray.filter(id => id !== postId);
      } else {
        likedPostsArray.push(postId);
      }

      localStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const copyCurrentUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Thành công",
        description: "Đã sao chép liên kết vào clipboard",
      });
    } catch (error) {
      console.error('Error copying URL:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể sao chép liên kết",
      });
    }
  };

  return (
    <div className='grid grid-cols-2 gap-3 w-full'>
      <Button
        variant="outline"
        onClick={toggleLike}
      >
        <Heart size={16} className={`mr-2 ${isLiked ? 'fill-red-500 stroke-red-600' : 'fill-white/80 stroke-gray-500 hover:fill-red-200 hover:stroke-red-400'}`} />
        {isLiked ? 'Đã lưu' : 'Lưu tin'}
      </Button>
      <Dialog>
        <Button>
          <DialogTrigger asChild className='w-full flex items-center cursor-pointer justify-center'>
            <p><Share2 size={16} className="mr-2" />
              Chia sẻ </p>
          </DialogTrigger>
        </Button>
        <DialogContent>
          <DialogDescription>
            Chia sẻ tin
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>Chia sẻ tin qua những nền tảng sau </DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-start gap-6'>
            <FacebookShareButton
              url={`https://www.fuland.vn/`}
              quote={`Xem tin tức tại Fuland`}
              hashtag={`#fuland`}
            >
              <div className='flex flex-col items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <FacebookIcon size={32} round />
                <p className='text-sm font-montserrat'>Facebook</p>
              </div>
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.fuland.vn/`}
              title={'Fuland - nơi tìm kiếm,mua bán,cho thuê nhà với giá ưu đãi. Truy cập ngay'}
            >
              <div className='flex flex-col items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Twitter size={32} />
                <p className='text-sm font-montserrat'>Twitter</p>
              </div>
            </TwitterShareButton>
            <button 
              onClick={copyCurrentUrl}
              className='flex flex-col items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                <Copy size={16} />
              </div>
              <p className='text-sm font-montserrat'>Copy Link</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        className='w-full h-12 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 font-medium col-span-2'
        onClick={() => console.log('Report post')}
      >
        <AlertTriangle size={16} className="mr-2" />
        Báo cáo tin
      </Button>
    </div>
  );
} 