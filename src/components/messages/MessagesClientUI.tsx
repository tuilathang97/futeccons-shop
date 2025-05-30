'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MessageList from './MessageList'; // To be created
import type { PaginatedResult, MessageWithDetails } from '@/actions/messageActions';
import { Inbox, Send } from 'lucide-react'; // Removed MailWarning

interface MessagesClientUIProps {
  initialSentMessages: PaginatedResult<MessageWithDetails>;
  initialReceivedMessages: PaginatedResult<MessageWithDetails>;
  userId: string;
  initialTab: 'sent' | 'received';
}

export default function MessagesClientUI({
  initialSentMessages,
  initialReceivedMessages,
  // userId, // This prop was unused, so it's commented out or can be removed.
  initialTab,
}: MessagesClientUIProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>(initialTab);

  const unreadCount = initialReceivedMessages.data.filter(
    (msg) => msg.status !== 'read' && !msg.readAt
  ).length;

  const handleTabChange = (value: string) => {
    const newTab = value as 'sent' | 'received';
    setActiveTab(newTab);
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('tab', newTab);
    currentParams.set('page', '1'); 
    router.push(`/account/messages?${currentParams.toString()}`);
  };

  // Effect to sync activeTab state if URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'sent' | 'received' | null;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  return (
    <div className="mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-brand-darkest dark:text-brand-light">
        Hộp thư của bạn
      </h1>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-brand-light/20 dark:bg-brand-darkest/30 p-1 h-auto rounded-lg">
          <TabsTrigger
            value="received"
            className="py-3 text-sm font-semibold flex items-center justify-center data-[state=active]:bg-brand-medium data-[state=active]:text-white dark:data-[state=active]:bg-brand-dark dark:data-[state=active]:text-brand-light data-[state=active]:shadow-md rounded-md transition-all duration-150 ease-in-out text-brand-dark dark:text-brand-light hover:bg-brand-light/50 dark:hover:bg-brand-darkest/50"
          >
            <Inbox className="mr-2 h-5 w-5 text-brand-dark group-data-[state=active]:text-white dark:text-brand-light dark:group-data-[state=active]:text-brand-light" />
            Tin nhắn đã nhận
            {unreadCount > 0 && (
              <span className="ml-2 bg-brand-dark text-white dark:bg-brand-light dark:text-brand-darkest text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="py-3 text-sm font-semibold flex items-center justify-center data-[state=active]:bg-brand-medium data-[state=active]:text-white dark:data-[state=active]:bg-brand-dark dark:data-[state=active]:text-brand-light data-[state=active]:shadow-md rounded-md transition-all duration-150 ease-in-out text-brand-dark dark:text-brand-light hover:bg-brand-light/50 dark:hover:bg-brand-darkest/50"
          >
            <Send className="mr-2 h-5 w-5 text-brand-dark group-data-[state=active]:text-white dark:text-brand-light dark:group-data-[state=active]:text-brand-light" />
            Tin nhắn đã gửi
          </TabsTrigger>
        </TabsList>
        <TabsContent value="received" className="mt-6">
          <MessageList
            messages={initialReceivedMessages.data}
            metadata={initialReceivedMessages.metadata}
            messageType="received"
          />
        </TabsContent>
        <TabsContent value="sent" className="mt-6">
          <MessageList
            messages={initialSentMessages.data}
            metadata={initialSentMessages.metadata}
            messageType="sent"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 