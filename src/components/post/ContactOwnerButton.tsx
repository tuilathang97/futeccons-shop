'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import SendMessageModal from './SendMessageModal';
import type { User, Post } from '@/db/schema';

interface ContactOwnerButtonProps {
  post: Post & { user: User };
  currentUser: User | null;
  loginUrl: string;
  pageCallbackUrl: string;
}

export default function ContactOwnerButton({ 
  post, 
  currentUser, 
  loginUrl, 
  pageCallbackUrl 
}: ContactOwnerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    if (!currentUser) {
      router.push(`${loginUrl}?callbackUrl=${encodeURIComponent(pageCallbackUrl)}`);
      return;
    }
    setIsModalOpen(true);
  };

  if (currentUser?.id === post.userId) {
    return null;
  }

  return (
    <>
      <Button onClick={handleOpenModal} variant="outline">
        <MessageSquare className="mr-2 h-4 w-4" />
        Liên hệ chủ nhà
      </Button>
      {currentUser && (
        <SendMessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipient={post.user}
          post={post}
          sender={currentUser}
        />
      )}
    </>
  );
} 