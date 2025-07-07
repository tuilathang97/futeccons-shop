'use client';

import React, { useState, useEffect } from 'react';
import { Province } from 'types';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProvincesLinksClientProps {
  provinces: Province[];
}

const ProvincesLinksClient = ({ provinces }: ProvincesLinksClientProps) => {
  const [showAll, setShowAll] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const INITIAL_ITEMS = 20;
  const displayedProvinces = showAll ? provinces : provinces.slice(0, INITIAL_ITEMS);
  const hasMore = provinces.length > INITIAL_ITEMS;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  return (
    <section className='container xl:px-0 py-16'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className="inline-flex items-center gap-2 text-brand-medium mb-4">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Khám phá theo vị trí</span>
          </div>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-brand-darkest mb-4 font-montserrat'>
            Tìm Kiếm Bất Động Sản Theo Tỉnh Thành
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Khám phá cơ hội đầu tư bất động sản tại các tỉnh thành trên toàn quốc với thông tin cập nhật và chính xác nhất
          </p>
        </div>

        {/* Provinces Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8'>
          {displayedProvinces.map((province) => (
            <Link 
              className='group relative p-1 md:p-2 text-center flex items-center justify-center' 
              href={`/ban-nha?thanhPho=${province.codename}`} 
              key={province.code}
            >
              <div className="space-y-2">
                {/* Province Icon/Number */}
                
                {/* Province Name */}
                <span className='block text-xs sm:text-sm md:text-base font-montserrat font-medium text-gray-700 leading-tight group-hover:underline decoration-2 underline-offset-2'>
                  {province.name}
                </span>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </Link>
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMore && (
          <div className='text-center'>
            <Button 
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="group bg-white/80 backdrop-blur-sm border-2 border-brand-medium/20 transition-all duration-300 font-montserrat font-semibold px-6 py-3 text-sm md:text-base"
            >
              <span className="mr-2">
                {showAll ? `Thu gọn (${provinces.length - INITIAL_ITEMS} ẩn)` : `Xem thêm ${provinces.length - INITIAL_ITEMS} tỉnh thành`}
              </span>
              {showAll ? (
                <ChevronUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 group-hover:scale-110 transition-transform" />
              )}
            </Button>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-8 mt-8">
          <div className="text-center text-gray-600">
            <p className="text-sm md:text-base font-montserrat">
              Đang có <strong className="text-brand-medium">{provinces.length}</strong> tỉnh thành với hàng ngàn tin đăng bất động sản
            </p>
            <p className="text-xs md:text-sm mt-1 text-gray-500">
              Cập nhật thông tin mới nhất về giá cả, xu hướng thị trường từng khu vực
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvincesLinksClient; 