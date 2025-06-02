'use client';

import { useEffect, useState, useCallback } from 'react';
import { getNotificationCounts } from '@/actions/notificationActions';

interface NotificationCounts {
  unreadMessages: number;
  pendingPosts: number;
}

interface UseNotificationCountsProps {
  enabled?: boolean;
  intervalMs?: number;
}

export function useNotificationCounts({
  enabled = true,
  intervalMs = 30000, // 30 seconds default
}: UseNotificationCountsProps) {
  const [counts, setCounts] = useState<NotificationCounts>({
    unreadMessages: 0,
    pendingPosts: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getNotificationCounts();
      setCounts(result);
    } catch (err) {
      console.error('Failed to fetch notification counts:', err);
      setError('Failed to fetch notification counts');
      // Reset counts on error
      setCounts({
        unreadMessages: 0,
        pendingPosts: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Interval fetching
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = setInterval(fetchCounts, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [fetchCounts, intervalMs, enabled]);

  return {
    counts,
    isLoading,
    error,
    refetch: fetchCounts,
  };
} 