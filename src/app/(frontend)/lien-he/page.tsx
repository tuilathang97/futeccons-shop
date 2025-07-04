import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brand-darkest mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-brand-dark">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi vấn đề về bất động sản
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-darkest">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-light rounded-lg">
                  <Phone className="h-5 w-5 text-brand-medium" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-darkest">Hotline</h3>
                  <p className="text-brand-dark">0765563567</p>
                  <p className="text-sm text-gray-600">Miễn phí từ 8:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-light rounded-lg">
                  <Mail className="h-5 w-5 text-brand-medium" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-darkest">Email</h3>
                  <p className="text-brand-dark">thanhlb1990@gmail.com</p>
                  <p className="text-sm text-gray-600">Phản hồi trong 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-light rounded-lg">
                  <MapPin className="h-5 w-5 text-brand-medium" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-darkest">Địa chỉ</h3>
                  <p className="text-brand-dark">12/66/3 đường ấp 4, Đông Thạnh, Hóc Môn, Hồ Chí Minh</p>
                  <p className="text-sm text-gray-600">Văn phòng chính</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-light rounded-lg">
                  <Clock className="h-5 w-5 text-brand-medium" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-darkest">Giờ làm việc</h3>
                  <p className="text-brand-dark">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  <p className="text-brand-dark">Thứ 7 - CN: 8:00 - 17:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-darkest">Gửi tin nhắn</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-darkest mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-darkest mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-darkest mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-darkest mb-1">
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    placeholder="Nhập tin nhắn của bạn"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-brand-medium text-white py-2 px-4 rounded-md hover:bg-brand-dark transition-colors duration-200"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 