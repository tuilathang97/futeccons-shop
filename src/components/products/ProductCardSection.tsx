"use client";

import React, { useEffect, useState } from 'react';
import { CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from 'next/navigation';
import { useCategories } from '@/contexts/CategoriesContext';
import { Post } from '@/db/schema';

export default function ProductCardSection({ post }: { post: Post }) {
  const router = useRouter();
  const path = usePathname()
  const [level1Ref, setLevel1Ref] = useState("");
  const { categories } = useCategories()
  useEffect(() => {
    const result = categories.find(category => category.id === post.level1Category)
    if (result)
        setLevel1Ref(result?.slug || "");
}, [categories, post.level1Category]);

  const formatPrice = () => {
    const numPrice = parseFloat(post.giaTien);
    if (isNaN(numPrice)) return "N/A";
    if (numPrice >= 1000000000) {
      return `${(numPrice / 1000000000).toFixed(1)} tỷ`;
    } else if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(0)} triệu`;
    }
    return numPrice.toLocaleString('vi-VN') + " đ";
  };

  const formatAddress = () => {
    return (
      <div className='flex flex-wrap items-center gap-1 text-xs' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
        <button
          className='hover:text-red-500 hover:underline'
          onClick={() => {
            router.push(`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}&phuong=${post.phuongCodeName}`)
          }}
        >
          {post.phuong || 'N/A'}
        </button>
        <button
          className='hover:text-red-500 hover:underline'
          onClick={() => {
            router.push(`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}`)
          }}
        >
          {post.quan || 'N/A'}
        </button>
        <button
          className='hover:text-red-500 hover:underline'
          onClick={() => {
            router.push(`${path !== "/" && path !== "/account" ? path : (level1Ref || '')}?thanhPho=${post.thanhPhoCodeName}`)
          }}
        >
          {post.thanhPho || 'N/A'}
        </button>
      </div>
    );
  };


  return (
    <div className="flex flex-col flex-grow py-3 gap-1.5">
      <div className="flex flex-wrap items-center">
        <span className="text-lg font-bold text-red-600 group-hover:text-red-800 transition-all duration-200">{formatPrice()}</span>
      </div>
      <CardTitle className="text-md font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight hover:text-brand-primary transition-colors duration-200" title={post.tieuDeBaiViet || undefined}>
        {post.tieuDeBaiViet || "Không có tiêu đề"}
      </CardTitle>
      <div>
        {formatAddress()}
      </div>
    </div>
  );
} 