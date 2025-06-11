'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Heart, Share2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface PostDetailClientActionsProps {
  postId: number; 
  postTitle: string;
}

export default function PostDetailClientActions({ postId, postTitle }: PostDetailClientActionsProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!session?.user) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để gửi tin nhắn.',
        variant: 'destructive'
      });
      router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(`/post/${postId}`)}`);
      return;
    }

    const userNumber = (session.user as any)?.number;

    if (!userNumber) {
      toast({
        title: 'Yêu cầu cập nhật số điện thoại',
        description: 'Vui lòng cập nhật số điện thoại trong tài khoản của bạn để gửi tin nhắn.',
        variant: 'destructive'
      });
      router.push(`/account?reason=phone_required&callbackUrl=${encodeURIComponent(`/post/${postId}`)}`);
      return;
    }

    console.log(`Initiating message for post: ${postTitle} (ID: ${postId}) by user ${session.user.id}`);
    toast({ title: 'Chức năng đang phát triển', description: 'Sẽ sớm có thể nhắn tin cho người bán.'});
  };

  return (
    <div className='grid grid-cols-2 gap-3 w-full'>
      <Button 
        variant="outline" 
        className='w-full h-12 text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-medium' 
        onClick={() => console.log('Save post')}
      > 
        <Heart size={16} className="mr-2" /> 
        Lưu tin
      </Button>
      <Button  
        className='w-full h-12 text-white font-medium' 
        onClick={handleSendMessage}
      > 
        <MessageSquare size={16} className="mr-2" /> 
        Nhắn tin người bán 
      </Button> 
      <Button 
        variant="outline" 
        className='w-full h-12 text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-medium' 
        onClick={() => console.log('Share post')}
      > 
        <Share2 size={16} className="mr-2" /> 
        Chia sẻ 
      </Button>
      <Button 
        variant="outline" 
        className='w-full h-12 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 font-medium' 
        onClick={() => console.log('Report post')}
      > 
        <AlertTriangle size={16} className="mr-2" /> 
        Báo cáo tin
      </Button>
    </div>
  );
} 