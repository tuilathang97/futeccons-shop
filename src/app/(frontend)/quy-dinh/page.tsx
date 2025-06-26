import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuyDinhPage() {
  const rules = [
    {
      title: "Thông tin bất động sản",
      icon: CheckCircle,
      color: "text-green-600",
      items: [
        "Cung cấp thông tin chính xác về địa chỉ, diện tích, giá cả",
        "Mô tả chi tiết và trung thực về tình trạng bất động sản",
        "Ghi rõ loại hình: bán, cho thuê, hoặc cần mua",
        "Đính kèm đầy đủ giấy tờ pháp lý nếu có yêu cầu"
      ]
    },
    {
      title: "Hình ảnh",
      icon: CheckCircle,
      color: "text-green-600",
      items: [
        "Sử dụng hình ảnh thực tế của bất động sản",
        "Chất lượng hình ảnh rõ nét, đủ sáng",
        "Tối thiểu 3 hình ảnh, tối đa 20 hình",
        "Không sử dụng hình ảnh có watermark của website khác"
      ]
    },
    {
      title: "Thông tin liên hệ",
      icon: CheckCircle,
      color: "text-green-600",
      items: [
        "Cung cấp số điện thoại chính xác và có thể liên lạc được",
        "Người đăng phải là chủ sở hữu hoặc được ủy quyền",
        "Không sử dụng số điện thoại ảo hoặc tạm thời",
        "Phản hồi tin nhắn và cuộc gọi một cách lịch sự"
      ]
    }
  ];

  const prohibited = [
    {
      title: "Nội dung cấm",
      icon: XCircle,
      color: "text-red-600",
      items: [
        "Đăng tin trùng lặp hoặc spam",
        "Sử dụng từ ngữ phản cảm, không phù hợp",
        "Quảng cáo dịch vụ không liên quan đến bất động sản",
        "Đăng thông tin giả mạo hoặc lừa đảo",
        "Sử dụng hình ảnh không phù hợp hoặc có bản quyền"
      ]
    },
    {
      title: "Hành vi vi phạm",
      icon: XCircle,
      color: "text-red-600",
      items: [
        "Tạo nhiều tài khoản để đăng tin trùng lặp",
        "Liên hệ khách hàng để chào mời dịch vụ khác",
        "Sử dụng thông tin liên hệ của người khác",
        "Đăng tin không có ý định thực sự giao dịch",
        "Can thiệp vào hoạt động của người dùng khác"
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
              <FileCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Quy định đăng tin
          </h1>
          <p className="text-brand-dark">
            Hướng dẫn và quy tắc để đăng tin hiệu quả và tuân thủ chính sách
          </p>
        </div>

        {/* Allowed Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-darkest mb-6 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Quy định bắt buộc
          </h2>
          <div className="grid gap-6">
            {rules.map((rule, index) => (
              <Card key={index} className="shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-darkest">
                    <rule.icon className={`h-5 w-5 ${rule.color}`} />
                    {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {rule.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Prohibited Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-darkest mb-6 flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-600" />
            Nội dung bị cấm
          </h2>
          <div className="grid gap-6">
            {prohibited.map((rule, index) => (
              <Card key={index} className="shadow-lg border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-darkest">
                    <rule.icon className={`h-5 w-5 ${rule.color}`} />
                    {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {rule.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <Card className="shadow-lg bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Hậu quả vi phạm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-800 space-y-2">
              <p><strong>Lần đầu vi phạm:</strong> Cảnh báo và yêu cầu chỉnh sửa</p>
              <p><strong>Vi phạm lặp lại:</strong> Xóa tin đăng và hạn chế đăng tin trong 7 ngày</p>
              <p><strong>Vi phạm nghiêm trọng:</strong> Khóa tài khoản vĩnh viễn</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-brand-dark mb-4">
            Có thắc mắc về quy định? Hãy liên hệ với chúng tôi
          </p>
          <div className="flex justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
} 