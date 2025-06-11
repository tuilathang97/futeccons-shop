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
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff&size=100",
    content: "Tôi đã tìm được căn hộ mơ ước nhờ nền tảng này. Dịch vụ hỗ trợ rất tận tình và chuyên nghiệp. Quy trình thuê nhà diễn ra nhanh chóng và minh bạch.",
    rating: 5
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=ef4444&color=fff&size=100",
    content: "Rất hài lòng với chất lượng dịch vụ. Nhân viên tư vấn nhiệt tình, giúp tôi tìm được nhà phù hợp với ngân sách. Chắc chắn sẽ giới thiệu cho bạn bè.",
    rating: 5
  },
  {
    id: 3,
    name: "Lê Minh Cường", 
    avatar: "https://ui-avatars.com/api/?name=Le+Minh+Cuong&background=10b981&color=fff&size=100",
    content: "Nền tảng có giao diện thân thiện, dễ sử dụng. Thông tin bất động sản đầy đủ và chính xác. Tôi đã bán được nhà trong thời gian ngắn với giá hợp lý.",
    rating: 4
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    avatar: "https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=f59e0b&color=fff&size=100", 
    content: "Đội ngũ hỗ trợ rất chuyên nghiệp. Họ giúp tôi hoàn thiện mọi thủ tục pháp lý một cách nhanh chóng. Dịch vụ đáng tin cậy và uy tín.",
    rating: 5
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    avatar: "https://ui-avatars.com/api/?name=Hoang+Van+Em&background=8b5cf6&color=fff&size=100",
    content: "Trải nghiệm tuyệt vời! Tôi đã tìm được căn hộ cho thuê phù hợp trong vòng 1 tuần. Giá cả hợp lý, vị trí đẹp. Cảm ơn team đã hỗ trợ tôi.",
    rating: 5
  }
];

export default function ReviewsCarousel() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-montserrat mb-4">
          Đánh Giá Từ Khách Hàng
        </h2>
        <p className="text-gray-600 text-lg font-montserrat">
          Những phản hồi chân thực từ khách hàng đã sử dụng dịch vụ của chúng tôi
        </p>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="flex justify-center">
              <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Avatar */}
                    <Avatar className="w-20 h-20 border-4 border-brand-light">
                      <AvatarImage 
                        src={review.avatar} 
                        alt={`Avatar của ${review.name}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-brand-light text-brand-dark text-lg font-semibold">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    
                    {/* Content */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed italic max-w-lg">
                      &ldquo;{review.content}&rdquo;
                    </blockquote>
                    
                    {/* Name */}
                    <div className="border-t pt-4 w-full">
                      <p className="font-semibold text-gray-900 text-xl">
                        {review.name}
                      </p>
                      <p className="text-brand-medium text-sm">
                        Khách hàng thân thiết
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="bg-brand-light hover:bg-brand-medium text-brand-dark border-brand-medium shadow-lg" />
        <CarouselNext className="bg-brand-light hover:bg-brand-medium text-brand-dark border-brand-medium shadow-lg" />
      </Carousel>
    </div>
  );
} 