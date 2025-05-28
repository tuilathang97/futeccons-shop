'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

interface SearchItem {
  title: string;
  url: string;
}

const popularSearches: SearchItem[] = [
  { title: 'Căn hộ dưới 2 tỷ tại TPHCM', url: '?city=ho-chi-minh&price=lt-2000000000' },
  { title: 'Nhà phố quận 7', url: '?city=ho-chi-minh&district=quan-7' },
  { title: 'Đất nền Long An', url: '?city=long-an' },
  { title: 'Chung cư Hà Nội dưới 3 tỷ', url: '?city=ha-noi&price=lt-3000000000' },
  { title: 'Biệt thự Đà Nẵng', url: '?city=da-nang&type=biet-thu' },
  { title: 'Nhà riêng dưới 10 tỷ', url: '?price=lt-10000000000&type=nha-rieng' },
  { title: 'Căn hộ 2 phòng ngủ', url: '?bedrooms=2' },
  { title: 'Đất nền giá rẻ', url: '?type=dat-nen&sort=price-asc' },
];

interface PopularSearchesProps {
  className?: string;
}

export default function PopularSearches({ className }: PopularSearchesProps) {
  const router = useRouter();

  const handleSearchClick = (url: string) => {
    // Get the base path without query params
    const basePath = window.location.pathname;
    router.push(`${basePath}${url}`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tìm kiếm phổ biến
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-2">
          {popularSearches.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSearchClick(item.url)}
              className="text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-b border-dashed border-gray-200 last:border-0"
            >
              {item.title}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 