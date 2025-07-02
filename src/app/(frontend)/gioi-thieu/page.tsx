import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Award, Target, Shield, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function GioiThieuPage() {
  const stats = [
    { icon: Users, label: "Người dùng", value: "10,000+" },
    { icon: Building, label: "Tin đăng", value: "50,000+" },
    { icon: Award, label: "Năm kinh nghiệm", value: "5+" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Tin cậy",
      description: "Cam kết cung cấp thông tin chính xác và bảo mật thông tin khách hàng"
    },
    {
      icon: Target,
      title: "Hiệu quả",
      description: "Nền tảng tối ưu giúp kết nối nhanh chóng giữa người mua và người bán"
    },
    {
      icon: HeartHandshake,
      title: "Tận tâm",
      description: "Hỗ trợ khách hàng 24/7 với đội ngũ chuyên nghiệp và nhiệt tình"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-4">
            Về Futeccons Shop
          </h1>
          <p className="text-lg text-brand-dark max-w-2xl mx-auto">
            Nền tảng bất động sản hàng đầu Việt Nam, kết nối những cơ hội đầu tư và an cư tốt nhất
          </p>
        </div>

        {/* Company Story */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-darkest">
              Câu chuyện của chúng tôi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Futeccons Shop được thành lập với sứ mệnh tạo ra một nền tảng bất động sản 
              minh bạch, hiệu quả và đáng tin cậy tại Việt Nam. Chúng tôi hiểu rằng việc 
              mua bán, cho thuê bất động sản là một quyết định quan trọng trong cuộc sống 
              của mỗi người.
            </p>
            <p>
              Với đội ngũ chuyên gia công nghệ và chuyên viên bất động sản giàu kinh nghiệm, 
              chúng tôi không ngừng cải tiến để mang đến trải nghiệm tốt nhất cho người dùng. 
              Từ việc tìm kiếm dễ dàng đến các công cụ so sánh thông minh, mọi tính năng 
              đều được thiết kế để phục vụ nhu cầu thực tế của thị trường.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-brand-light rounded-full">
                    <stat.icon className="h-6 w-6 text-brand-medium" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-brand-darkest mb-2">
                  {stat.value}
                </div>
                <div className="text-brand-dark">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-darkest text-center mb-8">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-medium rounded-full">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-darkest mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision */}
        <Card className="shadow-lg bg-gradient-to-r from-brand-light to-brand-medium/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-brand-darkest mb-4">
                Tầm nhìn 2030
              </h2>
              <p className="text-lg text-brand-dark max-w-3xl mx-auto">
                Trở thành nền tảng bất động sản số 1 Việt Nam, được tin dùng bởi 
                hàng triệu người dùng với hệ sinh thái dịch vụ toàn diện từ tìm kiếm, 
                giao dịch đến tư vấn đầu tư bất động sản.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-brand-light text-brand-darkest">
                  Công nghệ
                </Badge>
                <Badge variant="secondary" className="bg-brand-light text-brand-darkest">
                  Minh bạch
                </Badge>
                <Badge variant="secondary" className="bg-brand-light text-brand-darkest">
                  Uy tín
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-brand-darkest mb-4">
            Tham gia cùng chúng tôi
          </h3>
          <p className="text-brand-dark mb-6">
            Khám phá những cơ hội bất động sản tuyệt vời và trở thành một phần của cộng đồng Futeccons Shop
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dang-tin"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-medium text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
            >
              Đăng tin ngay
            </Link>
            <Link 
              href="/lien-he"
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-medium text-brand-medium rounded-lg hover:bg-brand-light transition-colors font-medium"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 