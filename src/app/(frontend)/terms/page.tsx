import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Fuland
          </h1>
          <p className="text-brand-dark">
            Nền tảng bất động sản hàng đầu
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-darkest">
              Điều Khoản Dịch Vụ
            </CardTitle>
            <div className="text-center text-brand-dark text-sm mt-4">
              <p>Ngày cập nhật cuối: {new Date().toLocaleDateString('vi-VN')}</p>
              <p>Có hiệu lực từ ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </CardHeader>

          <CardContent className="prose prose-gray max-w-none space-y-8">
            {/* 1. Giới thiệu */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">1. Giới Thiệu</h2>
              <p className="text-brand-dark leading-relaxed">
                Chào mừng bạn đến với Fuland - nền tảng thương mại điện tử bất động sản hàng đầu. 
                Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các 
                điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều 
                khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
              <p className="text-brand-dark leading-relaxed">
                Fuland được vận hành bởi Fuland, cung cấp dịch vụ kết nối người mua và người 
                bán bất động sản thông qua nền tảng trực tuyến.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 2. Định nghĩa */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">2. Định Nghĩa</h2>
              <ul className="space-y-2 text-brand-dark">
                <li><strong>&ldquo;Chúng tôi&rdquo;, &ldquo;Công ty&rdquo;:</strong> Fuland và nền tảng Fuland</li>
                <li><strong>&ldquo;Bạn&rdquo;, &ldquo;Người dùng&rdquo;:</strong> Cá nhân hoặc tổ chức sử dụng dịch vụ</li>
                <li><strong>&ldquo;Dịch vụ&rdquo;:</strong> Nền tảng thương mại điện tử bất động sản Fuland</li>
                <li><strong>&ldquo;Nội dung&rdquo;:</strong> Thông tin, hình ảnh, văn bản, dữ liệu được đăng tải</li>
                <li><strong>&ldquo;Tài khoản&rdquo;:</strong> Tài khoản người dùng được đăng ký trên hệ thống</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 3. Đăng ký tài khoản */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">3. Đăng Ký và Quản Lý Tài Khoản</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">3.1. Yêu cầu đăng ký</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản</li>
                <li>Thông tin đăng ký phải chính xác, đầy đủ và cập nhật</li>
                <li>Email phải là email hợp lệ từ các nhà cung cấp phổ biến</li>
                <li>Số điện thoại phải là số điện thoại Việt Nam hợp lệ</li>
                <li>Mật khẩu phải đáp ứng các yêu cầu bảo mật của hệ thống</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">3.2. Bảo mật tài khoản</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình</li>
                <li>Không chia sẻ tài khoản với người khác</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị xâm nhập</li>
                <li>Chúng tôi có quyền đình chỉ tài khoản có hoạt động đáng ngờ</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 4. Sử dụng dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">4. Sử Dụng Dịch Vụ</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">4.1. Quyền được phép</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Duyệt và tìm kiếm thông tin bất động sản</li>
                <li>Đăng tin rao bán/cho thuê bất động sản (sau khi xác thực)</li>
                <li>Liên hệ với người bán/cho thuê thông qua hệ thống tin nhắn</li>
                <li>Cập nhật thông tin cá nhân và quản lý tin đăng</li>
                <li>Sử dụng các tính năng hỗ trợ của nền tảng</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">4.2. Hành vi bị cấm</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Đăng thông tin sai lệch, gian lận về bất động sản</li>
                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Spam, quấy rối người dùng khác</li>
                <li>Tải lên nội dung có bản quyền mà không có sự cho phép</li>
                <li>Cố gắng xâm nhập, phá hoại hệ thống</li>
                <li>Tạo nhiều tài khoản ảo hoặc sử dụng bot</li>
                <li>Vi phạm pháp luật Việt Nam về kinh doanh bất động sản</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 5. Nội dung và tin đăng */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">5. Nội Dung và Tin Đăng</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">5.1. Quyền sở hữu nội dung</h3>
              <p className="text-brand-dark leading-relaxed">
                Bạn giữ quyền sở hữu đối với nội dung mà bạn đăng tải. Tuy nhiên, bằng việc đăng tải, 
                bạn cấp cho chúng tôi quyền sử dụng, hiển thị, phân phối nội dung đó trên nền tảng 
                nhằm cung cấp dịch vụ.
              </p>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">5.2. Yêu cầu nội dung</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Thông tin phải chính xác và cập nhật</li>
                <li>Hình ảnh phải rõ nét, không chỉnh sửa gây hiểu lầm</li>
                <li>Không chứa nội dung khiêu dâm, bạo lực, phân biệt chủng tộc</li>
                <li>Tuân thủ quy định về quảng cáo bất động sản của pháp luật</li>
                <li>Giá cả và thông tin pháp lý phải minh bạch</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">5.3. Kiểm duyệt</h3>
              <p className="text-brand-dark leading-relaxed">
                Chúng tôi có quyền (nhưng không có nghĩa vụ) kiểm duyệt, chỉnh sửa hoặc gỡ bỏ 
                bất kỳ nội dung nào vi phạm điều khoản này mà không cần thông báo trước.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 6. Hệ thống tin nhắn */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">6. Hệ Thống Tin Nhắn</h2>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Hệ thống tin nhắn chỉ dành cho việc trao đổi về bất động sản</li>
                <li>Không sử dụng để spam hoặc quảng cáo không liên quan</li>
                <li>Thông tin liên hệ cá nhân phải chính xác</li>
                <li>Chúng tôi có quyền giám sát tin nhắn để đảm bảo chất lượng dịch vụ</li>
                <li>Tin nhắn có thể bị lưu trữ trong thời gian nhất định theo quy định</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 7. Thanh toán và phí */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">7. Thanh Toán và Phí Dịch Vụ</h2>
              <p className="text-brand-dark leading-relaxed">
                Một số dịch vụ có thể tính phí. Khi đó, bạn sẽ được thông báo rõ ràng về mức phí 
                và phương thức thanh toán trước khi sử dụng. Việc thanh toán được thực hiện qua 
                các phương thức được hỗ trợ trên nền tảng.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 8. Trách nhiệm */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">8. Trách Nhiệm và Miễn Trừ</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">8.1. Trách nhiệm của chúng tôi</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Cung cấp nền tảng ổn định và bảo mật</li>
                <li>Bảo vệ thông tin cá nhân theo chính sách riêng tư</li>
                <li>Hỗ trợ người dùng khi gặp vấn đề kỹ thuật</li>
                <li>Kiểm duyệt nội dung cơ bản</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">8.2. Miễn trừ trách nhiệm</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Chúng tôi không chịu trách nhiệm về tính chính xác của thông tin do người dùng cung cấp</li>
                <li>Không đảm bảo việc giao dịch thành công giữa các bên</li>
                <li>Không chịu trách nhiệm về tranh chấp phát sinh từ giao dịch</li>
                <li>Không đảm bảo dịch vụ hoạt động liên tục 100%</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">8.3. Trách nhiệm của người dùng</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Cung cấp thông tin chính xác và cập nhật</li>
                <li>Tuân thủ pháp luật về kinh doanh bất động sản</li>
                <li>Chịu trách nhiệm về nội dung mình đăng tải</li>
                <li>Thực hiện giao dịch một cách trung thực</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 9. Bảo vệ dữ liệu */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">9. Bảo Vệ Dữ Liệu Cá Nhân</h2>
              <p className="text-brand-dark leading-relaxed">
                Việc thu thập, xử lý và bảo vệ dữ liệu cá nhân của bạn được quy định chi tiết trong{' '}
                <Link href="/privacy" className="text-brand-medium hover:text-brand-dark underline font-medium">
                  Chính Sách Bảo Mật
                </Link>{' '}
                của chúng tôi. Bằng việc sử dụng dịch vụ, bạn đồng ý với việc xử lý dữ liệu theo 
                chính sách đó.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 10. Sửa đổi điều khoản */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">10. Sửa Đổi Điều Khoản</h2>
              <p className="text-brand-dark leading-relaxed">
                Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Thay đổi sẽ có hiệu lực 
                ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi 
                được coi là chấp nhận các điều khoản mới.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 11. Chấm dứt dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">11. Chấm Dứt Dịch Vụ</h2>
              <p className="text-brand-dark leading-relaxed">
                Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu vi phạm các điều khoản này. 
                Bạn cũng có thể chấm dứt tài khoản bất cứ lúc nào bằng cách liên hệ với chúng tôi.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 12. Luật áp dụng */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">12. Luật Áp Dụng và Giải Quyết Tranh Chấp</h2>
              <p className="text-brand-dark leading-relaxed">
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh 
                sẽ được giải quyết thông qua thương lượng, hòa giải hoặc tại tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 13. Liên hệ */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">13. Thông Tin Liên Hệ</h2>
              <div className="bg-brand-light/30 p-6 rounded-lg border border-brand-light">
                <p className="text-brand-darkest leading-relaxed mb-4">
                  Nếu bạn có câu hỏi về điều khoản dịch vụ này, vui lòng liên hệ:
                </p>
                <div className="space-y-2 text-brand-darkest">
                  <p><strong>Công ty:</strong> Fuland</p>
                  <p><strong>Website:</strong> fuland.vn</p>
                  <p><strong>Email:</strong> thanhlb1990@gmail.com</p>
                  <p><strong>Hotline:</strong> 0765563567</p>
                  <p><strong>Địa chỉ:</strong> [Địa chỉ công ty Fuland]</p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="bg-gradient-to-r from-brand-light/30 to-brand-medium/20 p-6 rounded-lg border border-brand-medium/30">
              <p className="text-brand-darkest font-medium">
                Bằng việc tiếp tục sử dụng dịch vụ Fuland, bạn xác nhận rằng đã đọc, 
                hiểu và đồng ý tuân thủ tất cả các điều khoản và điều kiện nêu trên.
              </p>
            </section>

            <div className="text-center text-brand-dark pt-8">
              <p>
                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 