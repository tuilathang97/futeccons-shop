import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function BaoCaoLoiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500 rounded-full shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Báo cáo lỗi
          </h1>
          <p className="text-brand-dark">
            Hãy cho chúng tôi biết về các vấn đề bạn gặp phải
          </p>
        </div>

        {/* Report Form */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-brand-darkest">
              Mô tả lỗi gặp phải
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên *</Label>
                  <Input 
                    id="name"
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Tiêu đề lỗi *</Label>
                <Input 
                  id="subject"
                  placeholder="Tóm tắt ngắn gọn về lỗi"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết *</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về lỗi, các bước để tái hiện lỗi, và ảnh hưởng của lỗi..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="browser">Trình duyệt/Thiết bị</Label>
                <Input 
                  id="browser"
                  placeholder="VD: Chrome 120, Safari iOS, Android..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL trang gặp lỗi</Label>
                <Input 
                  id="url"
                  placeholder="https://futeccons.com/..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Gửi báo cáo lỗi
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
              Nếu lỗi nghiêm trọng và cần xử lý gấp, hãy liên hệ trực tiếp:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-medium" />
                <span className="text-sm">support@futeccons.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-medium" />
                <span className="text-sm">Hotline: 1900-xxx-xxx</span>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/lien-he"
                className="inline-flex items-center justify-center px-4 py-2 border border-brand-medium text-brand-medium rounded-lg hover:bg-brand-light transition-colors"
              >
                Trang liên hệ
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Lưu ý khi báo cáo lỗi:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Mô tả chi tiết các bước để tái hiện lỗi</li>
            <li>• Đính kèm ảnh chụp màn hình nếu có thể</li>
            <li>• Ghi rõ thời gian xảy ra lỗi</li>
            <li>• Cho biết tần suất xảy ra lỗi</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 