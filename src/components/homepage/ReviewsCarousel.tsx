'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
        className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  const review = reviews[currentIndex];

  return (
    <section className=" flex justify-center max-w-4xl mx-auto items-center px-4 py-12">
      

      <div className="relative h-full">
        <div className="flex justify-center">{renderStars(review.rating)}</div>
        <Card className="shadow-none px-4 py-4 bg-transparent">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <p className="text-gray-700 leading-8 md:leading-10 text-base md:text-lg italic font-montserrat">
              &ldquo;{review.content}&rdquo;
            </p>
            <div className='flex items-center gap-4'>
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



              <div className='flex items-start flex-col'>
                <h3 className="text-start text-base md:text-lg font-semibold text-gray-900">
                  {review.name}
                </h3>
                <p className="text-start text-sm text-gray-500">
                  {review.position} tại {review.company}
                </p>
              </div>
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
