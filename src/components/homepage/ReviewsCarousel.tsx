'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import reviewsData from '@/constants/reviews-data.json';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';

interface Review {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
  position: string;
  company: string;
}

export default function ReviewsCarousel() {
  const { reviews }: { reviews: Review[] } = reviewsData;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(interval);
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  const review = reviews[currentIndex];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Quote className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>
        <p className="text-gray-600">
          Những phản hồi chân thực từ khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi
        </p>
      </div>

      <div className="relative">
        <Card className="shadow-none px-4 py-4">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={review.avatar}
                alt={review.name}
              />
              <AvatarFallback>
                {review.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p className="text-gray-700 italic">
              &ldquo;{review.content}&rdquo;
            </p>

            <div className="flex justify-center">{renderStars(review.rating)}</div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {review.name}
              </h4>
              <p className="text-sm text-gray-500">
                {review.position} tại {review.company}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nút điều hướng */}
        <Button
          aria-label="previous slide"
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <Button
          aria-label="next slide"
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
    </section>
  );
}
