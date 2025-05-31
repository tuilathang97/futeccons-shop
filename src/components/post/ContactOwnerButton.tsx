'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import SendMessageModal from './SendMessageModal';
import type { User, Post } from '@/db/schema'; // Assuming these types are available

interface ContactOwnerButtonProps {
  post: Post & { user: User }; // Post with its owner (user)
  currentUser: User | null; // Currently logged-in user
}

export default function ContactOwnerButton({ post, currentUser }: ContactOwnerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để gửi tin nhắn.'); // Simple alert for now
      return;
    }
    setIsModalOpen(true);
  };

  // Prevent owner from messaging themselves
  if (currentUser?.id === post.userId) {
    return null; // Or a disabled button, or some other UI indication
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
          recipient={post.user} // The owner of the post
          post={post}
          sender={currentUser} // The person sending the message
        />
      )}
    </>
  );
} 