'use client';

import React from 'react';
import { MessageWithDetails } from '@/actions/messageActions';
import { UserSession } from '@/lib/auth-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { messagesTable, user } from '@/db/schema';
import ReplyForm from './ReplyForm';
import { Home, UserCircle, Clock, MessageSquareText, CornerDownRight, Link2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageThreadClientUIProps {
  messageDetails: MessageWithDetails;
  currentUser: UserSession['user'];
}

type DisplayableMessage = 
  (typeof messagesTable.$inferSelect & { 
    sender?: Pick<typeof user.$inferSelect, 'id' | 'name' | 'image'> 
  }) | MessageWithDetails;

interface MessageCardDisplayProps {
  message: DisplayableMessage;
  isReply?: boolean;
}

function MessageCardDisplay({ message, isReply = false }: MessageCardDisplayProps) {
  const senderName = message.sender?.name || 'Người dùng ẩn danh';
  const senderImage = message.sender?.image || undefined;

  return (
    <Card className={cn(
      "mb-4 shadow-lg rounded-lg",
      isReply 
        ? "ml-6 md:ml-10 bg-brand-light/10 dark:bg-brand-darkest/20 border-l-4 border-brand-medium dark:border-brand-dark" 
        : "bg-white dark:bg-brand-darkest/10 border-2 border-brand-medium/50 dark:border-brand-dark/50",
    )}>
      <CardHeader className="flex flex-row items-start space-x-3 p-4 pb-2">
        {isReply && <CornerDownRight className="h-5 w-5 text-brand-medium dark:text-brand-dark flex-shrink-0 mr-1 mt-1" />}
        <Avatar className="h-10 w-10 border-2 border-brand-light dark:border-brand-darkest">
          <AvatarImage src={senderImage} alt={senderName} />
          <AvatarFallback className="bg-brand-light/50 dark:bg-brand-darkest/50">
            <UserCircle className="h-6 w-6 text-brand-medium dark:text-brand-dark" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className={cn(
            "text-base font-semibold", 
            isReply 
              ? "text-brand-dark dark:text-brand-light/90" 
              : "text-brand-darkest dark:text-brand-light"
          )}>{senderName}</CardTitle>
          <CardDescription className="text-xs text-brand-medium dark:text-brand-dark flex items-center mt-0.5">
            <Clock className="mr-1.5 h-3 w-3" />
            {new Date(message.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        {!isReply && (message as MessageWithDetails).subject &&
          <p className="font-semibold mb-2 text-lg text-brand-darkest dark:text-brand-light">
             {(message as MessageWithDetails).subject}
          </p>
        }
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-brand-dark dark:text-brand-light/90 link:underline">
          {message.content}
        </div>
      </CardContent>
      {message.senderContactInfo && (
        <CardFooter className="text-xs text-brand-medium dark:text-brand-dark pt-2 pb-3 px-4 border-t border-brand-light/50 dark:border-brand-darkest/40 bg-brand-light/20 dark:bg-brand-darkest/30 mt-3 rounded-b-lg">
          <p>Thông tin liên hệ người gửi: <span className="font-medium text-brand-darkest dark:text-brand-light">{message.senderContactInfo}</span></p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function MessageThreadClientUI({ messageDetails, currentUser }: MessageThreadClientUIProps) {
  if (!messageDetails) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-brand-light/50 dark:border-brand-darkest/50 rounded-lg mt-8 bg-brand-light/10 dark:bg-brand-darkest/10">
        <MessageSquareText className="h-20 w-20 text-brand-medium dark:text-brand-dark mb-6" />
        <p className="text-xl font-semibold text-brand-darkest dark:text-brand-light">
          Không tìm thấy tin nhắn
        </p>
        <p className="text-sm text-brand-dark dark:text-brand-light/80 mt-2 max-w-md">
          Có vẻ như tin nhắn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/account/messages" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-medium hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark dark:bg-brand-dark dark:hover:bg-brand-medium dark:focus:ring-brand-light underline">
          <Home className="mr-2 h-4 w-4" />
          Quay lại Hộp thư
        </Link>
      </div>
    );
  }

  const { post, sender, recipient, replies } = messageDetails;
  const currentUserId = currentUser?.id;

  const isUserSender = currentUserId === sender?.id;
  const isUserRecipient = currentUserId === recipient?.id;
  const canReply = isUserSender || isUserRecipient;

  const replyToUser = isUserSender ? recipient : sender;

  return (
    <div className="container mx-auto max-w-3xl py-8 px-2 sm:px-4">
      <div className="mb-6 p-4 border border-brand-light/80 dark:border-brand-darkest/80 rounded-lg bg-white dark:bg-brand-darkest/20 shadow-md">
        <div className="flex items-center text-xl font-semibold mb-2 text-brand-darkest dark:text-brand-light">
          <MessageSquareText className="mr-2 h-6 w-6 text-brand-medium dark:text-brand-dark" />
          Chi tiết cuộc trò chuyện
        </div>
        {post && (
          <div className="text-sm text-brand-dark dark:text-brand-light/90 flex items-center">
            <Home className="mr-1.5 h-4 w-4 text-brand-medium dark:text-brand-dark" />
            <span>Liên quan đến bài đăng: </span>
            <Link
              href={`/post/${post.id}/${post.path || ''}`}
              className="ml-1 text-brand-medium hover:text-brand-dark dark:text-brand-dark dark:hover:text-brand-light font-semibold flex items-center underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.tieuDeBaiViet}
              <Link2 className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-8">
        <MessageCardDisplay message={messageDetails} />
        {replies && replies.length > 0 && (
          <div className="mt-0 pt-0">
            {replies.map((reply) => (
              <MessageCardDisplay key={reply.id} message={reply} isReply />
            ))}
          </div>
        )}
      </div>

      {canReply && replyToUser && (
        <div className="bg-white dark:bg-brand-darkest/20 p-4 sm:p-6 rounded-lg shadow-xl border border-brand-light/80 dark:border-brand-darkest/80">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-brand-darkest dark:text-brand-light">
            <Send className="mr-2 h-5 w-5 text-brand-medium dark:text-brand-dark" />
            Gửi trả lời {replyToUser.name ? `cho ${replyToUser.name}` : ''}
          </h3>
          {currentUser && <ReplyForm parentMessage={messageDetails} currentUser={currentUser} />}
        </div>
      )}
    </div>
  );
} 