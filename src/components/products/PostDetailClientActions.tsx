'use client';

import { Button } from '@/components/ui/button';
import { Heart, Share2, AlertTriangle } from 'lucide-react';

export default function PostDetailClientActions() {

 
  return (
    <div className='grid grid-cols-2 gap-3 w-full'>
      <Button 
        variant="outline"> 
        <Heart size={16} className="mr-2" /> 
        Lưu tin
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