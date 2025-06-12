"use client";

import React, { useEffect, useState } from 'react';
import { CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from 'next/navigation';
import { useCategories } from '@/contexts/CategoriesContext';
import { Post } from '@/db/schema';
import Link from 'next/link';
import { Bed, Toilet } from 'lucide-react';

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
    const addressPath = path !== "/" && path !== "/account"
    return (
      <div className='flex leading-5 flex-wrap items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 ' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
        <button
          className='hover:text-brand-dark whitespace-nowrap hover:underline'
          onClick={() => {
            router.push(`${addressPath ? path : level1Ref}?thanhPho=${post.thanhPhoCodeName}`)
          }}
        >
          {post.thanhPho || 'N/A'}
        </button>/
        <button
          className='hover:text-brand-dark whitespace-nowrap  hover:underline'
          onClick={() => {
            router.push(`${addressPath ? path : level1Ref}?thanhPho=${post.thanhPhoCodeName}&quan=${post.quanCodeName}`)
          }}
        >
          {post.quan || 'N/A'}
        </button>
      </div>
    );
  };


  return (
    <div className="flex flex-col flex-grow pt-[4px] pr-[20px] gap-[6px] ">
      <div className='flex flex-col mt-4 gap-2'>
        <Link href={`/post/${post.id}`} className='hover:underline'>
          <CardTitle className="text-base font-semibold dark:text-gray-200 hover:text-brand-primary transition-colors duration-200" title={post.tieuDeBaiViet || undefined}>
            {post.tieuDeBaiViet || "Không có tiêu đề"}
          </CardTitle>
        </Link>
        <div className='flex items-center gap-4'>
          <div className='flex text-sm font-semibold items-center gap-1'>
            <Bed className='w-4 h-4' />
            <span>{post.soPhongNgu} Phòng ngủ</span>
          </div>
          <div className='flex text-sm font-semibold items-center gap-1'>
            <Toilet className='w-4 h-4' />
            <span>{post.soPhongVeSinh} WC </span>
          </div>
        </div>
        <div className='text-sm line-clamp-3 text-gray-500'>
          {post.noiDung || "Không có nội dung "}
        </div>
        <div className="flex flex-wrap items-center">
          <p className="text-base font-light transition-all duration-200">Giá : <span className='text-brand-medium text-lg font-semibold'>{formatPrice()}</span></p>
        </div>
        {formatAddress()}
      </div>
    </div>
  );
} 