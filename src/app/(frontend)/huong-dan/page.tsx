import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Home, Upload, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function HuongDanPage() {
  const guides = [
    {
      icon: Home,
      title: "Tìm kiếm bất động sản",
      description: "Hướng dẫn tìm kiếm và lọc bất động sản phù hợp với nhu cầu của bạn",
      steps: [
        "Vào trang chủ và chọn loại bất động sản (Mua/Bán/Cho thuê)",
        "Sử dụng bộ lọc để chọn vị trí, giá cả, diện tích",
        "Xem chi tiết từng tin đăng",
        "Liên hệ chủ nhà qua số điện thoại hoặc tin nhắn"
      ]
    },
    {
      icon: Upload,
      title: "Đăng tin bán/cho thuê",
      description: "Hướng dẫn đăng tin bất động sản hiệu quả",
      steps: [
        "Đăng nhập/Đăng ký tài khoản",
        "Nhấn nút 'Đăng tin' ở góc phải",
        "Điền đầy đủ thông tin: loại BĐS, địa chỉ, giá, diện tích",
        "Tải lên hình ảnh chất lượng cao",
        "Viết mô tả chi tiết và hấp dẫn",
        "Kiểm tra và đăng tin"
      ]
    },
    {
      icon: MessageCircle,
      title: "Liên hệ và tương tác",
      description: "Cách liên hệ với chủ nhà và quản lý tin nhắn",
      steps: [
        "Nhấn 'Liên hệ' trên tin đăng",
        "Gửi tin nhắn hoặc gọi điện",
        "Kiểm tra tin nhắn trong mục 'Tài khoản'",
        "Trả lời tin nhắn một cách lịch sự và rõ ràng"
      ]
    },
    {
      icon: User,
      title: "Quản lý tài khoản",
      description: "Cách quản lý thông tin cá nhân và tin đăng",
      steps: [
        "Vào 'Tài khoản' để xem thông tin cá nhân",
        "Cập nhật số điện thoại để nhận liên hệ",
        "Quản lý tin đăng đã đăng",
        "Xem lịch sử tin nhắn"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Hướng dẫn sử dụng
          </h1>
          <p className="text-brand-dark">
            Tìm hiểu cách sử dụng Fuland Shop hiệu quả
          </p>
        </div>

        {/* Guides */}
        <div className="grid gap-8 md:grid-cols-2">
          {guides.map((guide, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-light rounded-lg">
                    <guide.icon className="h-5 w-5 text-brand-medium" />
                  </div>
                  <CardTitle className="text-xl text-brand-darkest">
                    {guide.title}
                  </CardTitle>
                </div>
                <p className="text-brand-dark text-sm">
                  {guide.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guide.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-brand-medium text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {stepIndex + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Support Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-brand-darkest">
              Cần hỗ trợ thêm?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-dark mb-4">
              Nếu bạn cần hỗ trợ thêm, hãy liên hệ với chúng tôi:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/lien-he" 
                className="inline-flex items-center justify-center px-4 py-2 bg-brand-medium text-white rounded-lg hover:bg-brand-dark transition-colors"
              >
                Liên hệ hỗ trợ
              </Link>
              <Link 
                href="/faq" 
                className="inline-flex items-center justify-center px-4 py-2 border border-brand-medium text-brand-medium rounded-lg hover:bg-brand-light transition-colors"
              >
                Xem FAQ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 