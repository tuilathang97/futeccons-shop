'use client';

import React from 'react';
import type { MessageWithDetails } from '@/actions/messageActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, User, Mail, Check, CheckCheck, MessageSquare, Clock, Eye } from 'lucide-react';

interface MessageCardProps {
  message: MessageWithDetails;
  messageType: 'sent' | 'received';
}

export default function MessageCard({ message, messageType }: MessageCardProps) {
  const { post, sender, recipient, subject, content, createdAt, status, readAt } = message;
  const otherParty = messageType === 'sent' ? recipient : sender;
  const isUnread = messageType === 'received' && status !== 'read' && !readAt;

  // Fallback for post title if post data is not fully populated (should be)
  const postTitle = post?.tieuDeBaiViet || 'Bài đăng không xác định';
  const postLink = post?.id ? `/post/${post.id}` : '#'; // Updated to use post.id directly

  return (
    <Card className={cn(
      "w-full transition-all duration-150 ease-in-out group", 
      "bg-white dark:bg-brand-darkest/10 shadow-lg hover:shadow-xl rounded-lg",
      isUnread 
        ? "border-2 border-brand-medium dark:border-brand-dark ring-2 ring-brand-medium/30 dark:ring-brand-dark/30" 
        : "border border-brand-light/70 dark:border-brand-darkest/70"
    )}>
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-11 w-11 border-2 border-brand-light dark:border-brand-darkest group-hover:border-brand-medium dark:group-hover:border-brand-dark transition-colors">
              <AvatarImage src={otherParty?.image || undefined} alt={otherParty?.name || 'User'} />
              <AvatarFallback className="bg-brand-light/50 dark:bg-brand-darkest/50 text-brand-medium dark:text-brand-dark">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold leading-tight mb-0.5 text-brand-darkest dark:text-brand-light">
                {messageType === 'sent' ? `Gửi đến: ` : `Từ: `}
                <span className="text-brand-medium dark:text-brand-dark font-bold">{otherParty?.name || 'N/A'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-brand-medium dark:text-brand-dark/80 flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </CardDescription>
            </div>
          </div>
          {messageType === 'received' && isUnread && (
            <div className="flex items-center text-brand-dark bg-brand-light dark:text-brand-light dark:bg-brand-darkest/80 font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              MỚI
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-3 px-4 border-t border-brand-light/50 dark:border-brand-darkest/50">
        <h3 className="font-medium mb-1.5 text-sm flex items-start">
          <Home className="mr-2 h-4 w-4 text-brand-medium dark:text-brand-dark flex-shrink-0 mt-0.5" />
          <Link 
            href={postLink} 
            className="hover:underline text-brand-dark hover:text-brand-darkest dark:text-brand-light/90 dark:hover:text-brand-light font-semibold line-clamp-1"
            title={postTitle}
          >
            {postTitle}
          </Link>
        </h3>
        <p 
            className="font-semibold text-base mb-1.5 text-brand-darkest dark:text-brand-light line-clamp-1"
            title={subject}
        >
            {subject}
        </p>
        <p 
            className="text-sm text-brand-dark/80 dark:text-brand-light/70 line-clamp-2 leading-relaxed"
            title={content}
        >
          {content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 pb-3 px-4 bg-brand-light/20 dark:bg-brand-darkest/20 border-t border-brand-light/50 dark:border-brand-darkest/50 rounded-b-lg">
        <div className="flex items-center text-xs">
          {status === 'sent' && <Check className="mr-1.5 h-4 w-4 text-blue-500 dark:text-blue-400" />}
          {status === 'read' && <CheckCheck className="mr-1.5 h-4 w-4 text-green-500 dark:text-green-400" />}
          {status === 'replied' && <MessageSquare className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />}
          <span className={cn(
            "font-semibold",
            status === 'sent' && "text-blue-600 dark:text-blue-300",
            status === 'read' && "text-green-600 dark:text-green-300",
            status === 'replied' && "text-purple-600 dark:text-purple-300"
          )}>
            {status === 'sent' ? 'Đã gửi' : status === 'read' ? 'Đã đọc' : status === 'replied' ? 'Đã trả lời' : status}
          </span>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-brand-medium hover:bg-brand-light/50 hover:text-brand-dark dark:text-brand-dark dark:hover:bg-brand-darkest/50 dark:hover:text-brand-light font-semibold px-3 py-1.5 rounded-md text-xs">
          <Link href={`/account/messages/${message.id}`} className="flex items-center">
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Xem chi tiết
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 