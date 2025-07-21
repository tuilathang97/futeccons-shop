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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/contexts/SessionContext';

// Form validation schema
const reportSchema = z.object({
  content: z.string()
    .min(10, 'Nội dung báo cáo phải có đầy đủ nội dung ')
    .max(500, 'Nội dung báo cáo không được quá dài vui lòng thử lại với đoạn văn ngắn hơn'),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function PostDetailClientActions({ postId }: { postId: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useSession();

  const reportForm = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      content: '',
    },
  });

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

  const requireAuth = (action: string): boolean => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: `Vui lòng đăng nhập để ${action}`,
      });
      return false;
    }
    return true;
  };

  const handleReportPost = () => {
    if (!requireAuth("báo cáo tin đăng")) return;
    setIsReportDialogOpen(true);
  };

  const onReportSubmit = (data: ReportFormData) => {
    toast({
      title: "Thành công",
      description: "Đã gửi báo cáo thành công. Chúng tôi sẽ xem xét và xử lý.",
    });

    // Reset form and close dialog
    reportForm.reset();
    setIsReportDialogOpen(false);
  };

  const handleReportCancel = () => {
    reportForm.reset();
    setIsReportDialogOpen(false);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMounted) return;
    
    if (!requireAuth("lưu tin đăng")) return;

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
      
      {/* Share Dialog - Available for all users */}
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

      {/* Report Dialog - Requires authentication */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <Button
          variant="outline"
          className='w-full h-12 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 font-medium col-span-2'
          onClick={handleReportPost}
        >
          <AlertTriangle size={16} className="mr-2" />
          Báo cáo tin
        </Button>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Báo cáo tin đăng</DialogTitle>
            <DialogDescription>
              Vui lòng mô tả lý do báo cáo tin đăng này. Chúng tôi sẽ xem xét và xử lý.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...reportForm}>
            <form onSubmit={reportForm.handleSubmit(onReportSubmit)} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID bài viết:</span> {postId}
                </p>
              </div>
              
              <FormField
                control={reportForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nội dung báo cáo <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập lý do báo cáo "
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      {field.value.length}/500 ký tự
                    </p>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleReportCancel}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!reportForm.formState.isValid}
                >
                  Gửi báo cáo
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 