'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface MissingPhoneNumberBannerProps {
  callbackUrl?: string | null;
}

export default function MissingPhoneNumberBanner({ callbackUrl }: MissingPhoneNumberBannerProps) {
  return (
    <div className="mb-4 flex items-center gap-x-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/10">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-yellow-700 dark:text-yellow-200">
          Vui lòng cập nhật số điện thoại của bạn để tiếp tục. 
          {callbackUrl && (
            <Link href={callbackUrl} className="font-medium underline hover:text-yellow-800 dark:hover:text-yellow-100">
              Nhấn vào đây để quay lại trang trước sau khi cập nhật.
            </Link>
          )}
        </p>
      </div>
    </div>
  );
} 