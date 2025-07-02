export const dynamic = 'force-dynamic';
import React from 'react';
import { getServerSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { getSentMessages, getReceivedMessages, type PaginationParams } from '@/actions/messageActions';
import MessagesClientUI from '@/components/messages/MessagesClientUI';

interface MessagesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    tab?: 'sent' | 'received';
    // Potentially other filters later
  }>;
}

const DEFAULT_PAGE_SIZE = 10;

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/account/messages');
  }

  if (!session.user.number) {
    return redirect('/account?reason=phone_required&callbackUrl=' + encodeURIComponent('/account/messages'));
  }

  const { page: pageParam, pageSize: pageSizeParam, tab: tabParam } = await searchParams;

  const userId = session.user?.id;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : DEFAULT_PAGE_SIZE;
  const activeTab = tabParam || 'received';

  const paginationParams: PaginationParams = {
    page: isNaN(currentPage) ? 1 : currentPage,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
  };

  const sentMessagesPromise = getSentMessages(userId, paginationParams);
  const receivedMessagesPromise = getReceivedMessages(userId, paginationParams);

  const [sentMessagesResult, receivedMessagesResult] = await Promise.all([
    sentMessagesPromise,
    receivedMessagesPromise,
  ]);

  return (
    <div className="container mx-auto py-8">
      <MessagesClientUI
        initialSentMessages={sentMessagesResult}
        initialReceivedMessages={receivedMessagesResult}
        userId={userId}
        initialTab={activeTab}
      />
    </div>
  );
} 