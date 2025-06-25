'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import reviewsData from '@/constants/reviews-data.json';

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'fill-amber-400 text-amber-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <Quote className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Những phản hồi chân thực từ khách hàng đã tin tưởng và sử dụng dịch vụ của FutecCons Shop
        </p>
      </div>
      
      <Carousel 
        className="w-full" 
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="h-full bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative p-8 h-full flex flex-col">
                      {/* Rating stars */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-1 bg-amber-50 px-4 py-2 rounded-full">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      {/* Quote icon */}
                      <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Quote className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <blockquote className="text-gray-700 text-lg leading-relaxed text-center mb-8 flex-grow italic">
                        &ldquo;{review.content}&rdquo;
                      </blockquote>
                      
                      {/* Author info */}
                      <div className="text-center border-t pt-6">
                        <div className="flex flex-col items-center space-y-4">
                          {/* Avatar */}
                          <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-2 ring-blue-100">
                            <AvatarImage 
                              src={review.avatar} 
                              alt={`Avatar của ${review.name}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Name and position */}
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 text-xl">
                              {review.name}
                            </h4>
                            <p className="text-blue-600 font-medium">
                              {review.position}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {review.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="bg-white hover:bg-blue-50 text-gray-700 border-2 border-blue-100 shadow-lg hover:border-blue-300 transition-all duration-200 -left-6" />
        <CarouselNext className="bg-white hover:bg-blue-50 text-gray-700 border-2 border-blue-100 shadow-lg hover:border-blue-300 transition-all duration-200 -right-6" />
      </Carousel>
      
      {/* Bottom decoration */}
      <div className="flex justify-center mt-12">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"
            />
          ))}
        </div>
      </div>
    </section>
  );
} 