import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Handshake, Building, Users, TrendingUp, Mail, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DoiTacPage() {
  const partnerships = [
    {
      icon: Building,
      title: "Đối tác bất động sản",
      description: "Sàn giao dịch, công ty môi giới, chủ đầu tư dự án",
      benefits: ["Chia sẻ doanh thu", "Hỗ trợ marketing", "Đào tạo nhân viên"]
    },
    {
      icon: Users,
      title: "Đối tác công nghệ",
      description: "Công ty phần mềm, startup công nghệ, fintech",
      benefits: ["Tích hợp API", "Phát triển chung", "Chia sẻ dữ liệu"]
    },
    {
      icon: TrendingUp,
      title: "Đối tác truyền thông",
      description: "Báo chí, kênh truyền hình, influencer",
      benefits: ["Quảng bá thương hiệu", "Content marketing", "Sự kiện chung"]
    }
  ];

  const benefits = [
    "Tiếp cận cơ sở khách hàng rộng lớn",
    "Chia sẻ nguồn lực và kinh nghiệm",
    "Cơ hội phát triển sản phẩm mới",
    "Hỗ trợ marketing và quảng bá",
    "Đào tạo và phát triển nhân sự",
    "Chia sẻ doanh thu hấp dẫn"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <Handshake className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-4">
            Đối tác chiến lược
          </h1>
          <p className="text-lg text-brand-dark max-w-2xl mx-auto">
            Cùng Futeccons Shop xây dựng hệ sinh thái bất động sản toàn diện và phát triển bền vững
          </p>
        </div>

        {/* Partnership Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-darkest text-center mb-8">
            Các hình thức hợp tác
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerships.map((partnership, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-light rounded-lg">
                      <partnership.icon className="h-6 w-6 text-brand-medium" />
                    </div>
                    <CardTitle className="text-lg text-brand-darkest">
                      {partnership.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-brand-dark">
                    {partnership.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {partnership.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-darkest text-center">
              Lợi ích khi hợp tác
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partnership Application Form */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-brand-darkest">
              Đăng ký hợp tác
            </CardTitle>
            <p className="text-brand-dark">
              Gửi thông tin để chúng tôi liên hệ và trao đổi về cơ hội hợp tác
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Tên công ty/tổ chức *</Label>
                  <Input 
                    id="company"
                    placeholder="Nhập tên công ty"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Người liên hệ *</Label>
                  <Input 
                    id="contact-name"
                    placeholder="Họ tên người đại diện"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input 
                    id="phone"
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnership-type">Loại hình hợp tác quan tâm</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-brand-light">
                    Đối tác bất động sản
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-brand-light">
                    Đối tác công nghệ
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-brand-light">
                    Đối tác truyền thông
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-brand-light">
                    Khác
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả về công ty và đề xuất hợp tác</Label>
                <Textarea
                  id="description"
                  placeholder="Giới thiệu về công ty, lĩnh vực hoạt động và ý tưởng hợp tác..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brand-medium hover:bg-brand-dark text-white"
              >
                Gửi đăng ký hợp tác
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-brand-darkest">
              Liên hệ trực tiếp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-dark mb-4">
              Để trao đổi trực tiếp về cơ hội hợp tác, vui lòng liên hệ:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-medium" />
                <span className="text-sm">partnership@futeccons.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-medium" />
                <span className="text-sm">Hotline đối tác: 1900-xxx-xxx</span>
              </div>
            </div>
            <Link 
              href="/lien-he"
              className="inline-flex items-center justify-center px-4 py-2 border border-brand-medium text-brand-medium rounded-lg hover:bg-brand-light transition-colors"
            >
              Trang liên hệ chung
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 