'use client';

import React from 'react';
import type { MessageWithDetails } from '@/actions/messageActions';
import MessageCard from './MessageCard'; // To be created
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Inbox, Send, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'; // Added icons

interface MessageListProps {
  messages: MessageWithDetails[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  messageType: 'sent' | 'received';
}

export default function MessageList({
  messages,
  metadata,
  messageType,
}: MessageListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentPage, totalPages } = metadata;

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('page', String(newPage));
    if (!currentParams.has('tab')) {
      currentParams.set('tab', messageType); // Default to messageType if tab isn't set
    }
    router.push(`/account/messages?${currentParams.toString()}`);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-brand-light/50 dark:border-brand-darkest/50 rounded-lg mt-8 bg-brand-light/10 dark:bg-brand-darkest/10">
        {messageType === 'received' ? (
          <Inbox className="h-20 w-20 text-brand-medium dark:text-brand-dark mb-6" />
        ) : (
          <Send className="h-20 w-20 text-brand-medium dark:text-brand-dark mb-6" />
        )}
        <p className="text-xl font-semibold text-brand-darkest dark:text-brand-light">
          Không có tin nhắn nào.
        </p>
        <p className="text-sm text-brand-dark dark:text-brand-light/80 mt-2 max-w-md">
          {messageType === 'received'
            ? 'Khi bạn nhận được tin nhắn mới, chúng sẽ xuất hiện ở đây. Hãy kiểm tra thường xuyên nhé!'
            : 'Hộp thư đi của bạn trống trơn. Hãy bắt đầu một cuộc trò chuyện mới!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Consider adding a title here if needed, e.g., based on messageType */}
      {/* <h2 className="text-2xl font-semibold tracking-tight">{messageType === 'received' ? 'Tin nhắn đã nhận' : 'Tin nhắn đã gửi'}</h2> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            // currentUserId={userId} // This prop was unused and its definition removed
            messageType={messageType}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 pt-6 border-t border-brand-light/50 dark:border-brand-darkest/50">
          <Pagination>
            <PaginationContent className="flex items-center justify-center gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage <= 1}
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background h-10 px-3 sm:px-4 py-2 hover:bg-brand-light/30 dark:hover:bg-brand-darkest/30 disabled:pointer-events-none disabled:opacity-50 ${
                    currentPage <= 1
                      ? 'pointer-events-none opacity-50 text-brand-dark/50 dark:text-brand-light/50'
                      : 'text-brand-dark hover:text-brand-darkest dark:text-brand-light dark:hover:text-white'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  Trước
                </PaginationPrevious>
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1); // Show 1 page around current

                if (!showPage) {
                  // Render ellipsis if not already rendered and conditions met
                  if (
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${pageNum}`}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 px-2 py-2 text-brand-dark dark:text-brand-light"
                          aria-hidden="true"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background h-10 w-10 px-2 py-2 ${
                        currentPage === pageNum
                          ? 'bg-brand-medium text-white dark:bg-brand-dark dark:text-brand-light shadow-md'
                          : 'text-brand-dark hover:bg-brand-light/30 hover:text-brand-darkest dark:text-brand-light dark:hover:bg-brand-darkest/30 dark:hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage >= totalPages}
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background h-10 px-3 sm:px-4 py-2 hover:bg-brand-light/30 dark:hover:bg-brand-darkest/30 disabled:pointer-events-none disabled:opacity-50 ${
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50 text-brand-dark/50 dark:text-brand-light/50'
                      : 'text-brand-dark hover:text-brand-darkest dark:text-brand-light dark:hover:text-white'
                  }`}
                >
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 