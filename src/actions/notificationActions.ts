'use server';

import { revalidateTag } from 'next/cache';
import { getServerSession } from '@/lib/auth-utils';
import { getUnreadMessageCount } from '@/lib/queries/messageQueries';
import { getPendingApprovalCount } from '@/lib/queries/postQueries';

/**
 * Revalidate message-related caches when new messages are sent or read
 */
export async function revalidateMessageNotifications(): Promise<void> {
  revalidateTag('messages:count');
  revalidateTag('messages:recent');
  revalidateTag('messages');
}

/**
 * Revalidate post-related caches when posts are approved or submitted
 */
export async function revalidatePostNotifications(): Promise<void> {
  revalidateTag('posts:count');
  revalidateTag('posts:recent');
  revalidateTag('posts:inactive');
  revalidateTag('posts');
}


export async function revalidateAllNotifications(): Promise<void> {
  await revalidateMessageNotifications();
  await revalidatePostNotifications();
}


export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id || null;
}


export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await getServerSession();
  return session?.user?.role === 'admin';
}

export async function getNotificationCounts(): Promise<{
  unreadMessages: number;
  pendingPosts: number;
}> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return {
        unreadMessages: 0,
        pendingPosts: 0,
      };
    }

    const isAdmin = session.user.role === 'admin';
    
    const promises: Promise<number>[] = [
      getUnreadMessageCount(session.user.id),
    ];

    if (isAdmin) {
      promises.push(getPendingApprovalCount());
    }

    const results = await Promise.all(promises);

    return {
      unreadMessages: results[0] || 0,
      pendingPosts: isAdmin ? (results[1] || 0) : 0,
    };
  } catch (error) {
    console.error('Failed to fetch notification counts:', error);
    return {
      unreadMessages: 0,
      pendingPosts: 0,
    };
  }
} 