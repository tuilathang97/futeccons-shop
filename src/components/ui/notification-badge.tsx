import React from 'react';
import { Badge } from './badge';

interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  maxCount?: number;
  className?: string;
}

export function NotificationBadge({ 
  count, 
  variant = 'destructive', 
  maxCount = 99,
  className = ''
}: NotificationBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <Badge 
      variant={variant} 
      className={`h-5 min-w-5 text-xs ${className}`}
    >
      {displayCount}
    </Badge>
  );
} 