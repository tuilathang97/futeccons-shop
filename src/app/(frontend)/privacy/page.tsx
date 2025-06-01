import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Futeccons Shop
          </h1>
          <p className="text-brand-dark">
            Nền tảng bất động sản hàng đầu
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-darkest">
              Chính Sách Bảo Mật
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
                Futeccons Shop cam kết bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này 
                giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân 
                khi bạn sử dụng nền tảng thương mại điện tử bất động sản của chúng tôi.
              </p>
              <p className="text-brand-dark leading-relaxed">
                Bằng việc sử dụng dịch vụ, bạn đồng ý với việc thu thập và sử dụng thông tin 
                theo chính sách này. Chúng tôi khuyến khích bạn đọc kỹ để hiểu rõ về các thực hành 
                bảo mật của chúng tôi.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 2. Thông tin chúng tôi thu thập */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">2.1. Thông tin bạn cung cấp trực tiếp</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li><strong>Thông tin tài khoản:</strong> Họ tên, email, số điện thoại, mật khẩu</li>
                <li><strong>Thông tin hồ sơ:</strong> Ảnh đại diện, thông tin liên hệ bổ sung</li>
                <li><strong>Thông tin bất động sản:</strong> Địa chỉ, mô tả, giá cả, hình ảnh</li>
                <li><strong>Nội dung giao tiếp:</strong> Tin nhắn, bình luận, phản hồi</li>
                <li><strong>Thông tin thanh toán:</strong> Chi tiết giao dịch (không lưu trữ thông tin thẻ)</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">2.2. Thông tin thu thập tự động</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li><strong>Thông tin thiết bị:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành</li>
                <li><strong>Thông tin sử dụng:</strong> Trang được xem, thời gian truy cập, tính năng sử dụng</li>
                <li><strong>Cookies và công nghệ tương tự:</strong> Để cải thiện trải nghiệm người dùng</li>
                <li><strong>Thông tin vị trí:</strong> Vị trí gần đúng (nếu được cho phép)</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">2.3. Thông tin từ bên thứ ba</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Thông tin từ các dịch vụ đăng nhập xã hội (nếu bạn chọn sử dụng)</li>
                <li>Dữ liệu từ các đối tác kinh doanh (trong phạm vi được phép)</li>
                <li>Thông tin công khai về bất động sản từ các nguồn hợp pháp</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 3. Cách chúng tôi sử dụng thông tin */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">3.1. Cung cấp và cải thiện dịch vụ</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Tạo và quản lý tài khoản người dùng</li>
                <li>Hiển thị danh sách bất động sản phù hợp</li>
                <li>Tạo điều kiện giao tiếp giữa người mua và người bán</li>
                <li>Xử lý giao dịch và thanh toán</li>
                <li>Cung cấp hỗ trợ khách hàng</li>
                <li>Cải thiện tính năng và hiệu suất nền tảng</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">3.2. Giao tiếp và tiếp thị</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Gửi thông báo về dịch vụ và cập nhật tài khoản</li>
                <li>Gửi email marketing (với sự đồng ý của bạn)</li>
                <li>Thông báo về bất động sản mới phù hợp với sở thích</li>
                <li>Khảo sát ý kiến và phản hồi</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">3.3. Bảo mật và tuân thủ</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Phát hiện và ngăn chặn gian lận</li>
                <li>Đảm bảo an ninh và bảo mật nền tảng</li>
                <li>Tuân thủ các yêu cầu pháp lý và quy định</li>
                <li>Giải quyết tranh chấp và khiếu nại</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 4. Chia sẻ thông tin */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">4. Chia Sẻ Thông Tin</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">4.1. Chia sẻ có kiểm soát</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li><strong>Với người dùng khác:</strong> Thông tin liên hệ cơ bản khi có yêu cầu kết nối</li>
                <li><strong>Thông tin công khai:</strong> Danh sách bất động sản (không bao gồm thông tin cá nhân nhạy cảm)</li>
                <li><strong>Đối tác dịch vụ:</strong> Nhà cung cấp thanh toán, dịch vụ cloud, analytics</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">4.2. Chia sẻ theo yêu cầu pháp lý</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Tuân thủ lệnh tòa án hoặc yêu cầu của cơ quan chức năng</li>
                <li>Bảo vệ quyền, tài sản và an toàn của chúng tôi và người dùng</li>
                <li>Điều tra gian lận hoặc vi phạm điều khoản sử dụng</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">4.3. Chuyển giao kinh doanh</h3>
              <p className="text-brand-dark leading-relaxed">
                Trong trường hợp sáp nhập, mua lại hoặc bán tài sản, thông tin người dùng có thể 
                được chuyển giao như một phần của giao dịch, với điều kiện bên nhận tuân thủ 
                chính sách bảo mật này.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 5. Bảo mật thông tin */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">5. Bảo Mật Thông Tin</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">5.1. Biện pháp kỹ thuật</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Mã hóa dữ liệu trong quá trình truyền tải (SSL/TLS)</li>
                <li>Mã hóa mật khẩu và thông tin nhạy cảm</li>
                <li>Tường lửa và hệ thống phát hiện xâm nhập</li>
                <li>Sao lưu dữ liệu định kỳ và an toàn</li>
                <li>Cập nhật bảo mật thường xuyên</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">5.2. Biện pháp tổ chức</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Đào tạo nhân viên về bảo mật thông tin</li>
                <li>Kiểm soát truy cập dựa trên vai trò</li>
                <li>Giám sát và đánh giá bảo mật định kỳ</li>
                <li>Chính sách và quy trình bảo mật rõ ràng</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">5.3. Lưu trữ dữ liệu</h3>
              <p className="text-brand-dark leading-relaxed">
                Dữ liệu được lưu trữ trên các máy chủ bảo mật tại các trung tâm dữ liệu đạt 
                tiêu chuẩn quốc tế. Chúng tôi chỉ lưu giữ thông tin trong thời gian cần thiết 
                để thực hiện các mục đích đã nêu hoặc theo yêu cầu pháp lý.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 6. Quyền của bạn */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">6. Quyền Của Bạn</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">6.1. Quyền truy cập và cập nhật</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Xem và cập nhật thông tin cá nhân của bạn</li>
                <li>Tải xuống dữ liệu cá nhân (data portability)</li>
                <li>Sửa đổi thông tin không chính xác</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">6.2. Quyền kiểm soát</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Từ chối nhận email marketing</li>
                <li>Tắt thông báo đẩy trên thiết bị</li>
                <li>Quản lý cài đặt cookie</li>
                <li>Hạn chế việc chia sẻ thông tin nhất định</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">6.3. Quyền xóa</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân</li>
                <li>Gỡ bỏ tin đăng và nội dung đã tạo</li>
                <li>Lưu ý: Một số thông tin có thể được giữ lại theo yêu cầu pháp lý</li>
              </ul>

              <div className="bg-brand-light/20 p-4 rounded-lg mt-6 border border-brand-light">
                <p className="text-brand-darkest text-sm">
                  <strong>Cách thực hiện quyền:</strong> Liên hệ với chúng tôi qua email 
                  support@futeccons.com hoặc sử dụng các tùy chọn trong tài khoản của bạn.
                </p>
              </div>
            </section>

            <Separator className="border-brand-light" />

            {/* 7. Cookies và công nghệ theo dõi */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">7. Cookies và Công Nghệ Theo Dõi</h2>
              
              <h3 className="text-xl font-medium text-brand-dark mb-3">7.1. Loại cookies chúng tôi sử dụng</h3>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark">
                <li><strong>Cookies cần thiết:</strong> Đảm bảo chức năng cơ bản của website</li>
                <li><strong>Cookies hiệu suất:</strong> Phân tích cách sử dụng website</li>
                <li><strong>Cookies chức năng:</strong> Ghi nhớ tùy chọn và cài đặt</li>
                <li><strong>Cookies tiếp thị:</strong> Cá nhân hóa quảng cáo (với sự đồng ý)</li>
              </ul>

              <h3 className="text-xl font-medium text-brand-dark mb-3 mt-6">7.2. Quản lý cookies</h3>
              <p className="text-brand-dark leading-relaxed">
                Bạn có thể quản lý cookies thông qua cài đặt trình duyệt hoặc sử dụng công cụ 
                quản lý cookie trên website của chúng tôi. Tắt cookies có thể ảnh hưởng đến 
                một số chức năng của website.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 8. Bảo vệ trẻ em */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">8. Bảo Vệ Trẻ Em</h2>
              <p className="text-brand-dark leading-relaxed">
                Dịch vụ của chúng tôi không dành cho trẻ em dưới 18 tuổi. Chúng tôi không cố ý 
                thu thập thông tin cá nhân từ trẻ em dưới 18 tuổi. Nếu phát hiện trường hợp này, 
                chúng tôi sẽ xóa thông tin đó ngay lập tức.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 9. Chuyển giao dữ liệu quốc tế */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">9. Chuyển Giao Dữ Liệu Quốc Tế</h2>
              <p className="text-brand-dark leading-relaxed">
                Dữ liệu của bạn chủ yếu được lưu trữ tại Việt Nam. Trong một số trường hợp, 
                dữ liệu có thể được chuyển và xử lý ở các quốc gia khác để cung cấp dịch vụ. 
                Chúng tôi đảm bảo áp dụng các biện pháp bảo vệ phù hợp theo tiêu chuẩn quốc tế.
              </p>
            </section>

            <Separator className="border-brand-light" />

            {/* 10. Thay đổi chính sách */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">10. Thay Đổi Chính Sách Bảo Mật</h2>
              <p className="text-brand-dark leading-relaxed">
                Chúng tôi có thể cập nhật chính sách bảo mật này để phản ánh thay đổi trong 
                thực hành hoặc yêu cầu pháp lý. Thay đổi quan trọng sẽ được thông báo qua:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-dark mt-4">
                <li>Email thông báo đến người dùng đã đăng ký</li>
                <li>Thông báo nổi bật trên website</li>
                <li>Cập nhật ngày hiệu lực ở đầu chính sách này</li>
              </ul>
            </section>

            <Separator className="border-brand-light" />

            {/* 11. Liên hệ */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">11. Liên Hệ Về Bảo Mật</h2>
              <div className="bg-brand-light/30 p-6 rounded-lg border border-brand-light">
                <p className="text-brand-darkest leading-relaxed mb-4">
                  Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện các quyền 
                  của mình, vui lòng liên hệ:
                </p>
                <div className="space-y-2 text-brand-darkest">
                  <p><strong>Bộ phận Bảo mật Dữ liệu:</strong> Futeccons</p>
                  <p><strong>Email:</strong> privacy@futeccons.com</p>
                  <p><strong>Email hỗ trợ:</strong> support@futeccons.com</p>
                  <p><strong>Hotline:</strong> 1900-xxx-xxx</p>
                  <p><strong>Địa chỉ:</strong> [Địa chỉ công ty Futeccons]</p>
                </div>
              </div>
            </section>

            <Separator className="border-brand-light" />

            {/* 12. Điều khoản liên quan */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-darkest mb-4">12. Điều Khoản Liên Quan</h2>
              <p className="text-brand-dark leading-relaxed">
                Chính sách bảo mật này hoạt động cùng với{' '}
                <Link href="/terms" className="text-brand-medium hover:text-brand-dark underline font-medium">
                  Điều Khoản Dịch Vụ
                </Link>{' '}
                của chúng tôi. Vui lòng đọc cả hai tài liệu để hiểu đầy đủ về quyền và 
                nghĩa vụ khi sử dụng dịch vụ Futeccons Shop.
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="bg-gradient-to-r from-brand-light/30 to-brand-medium/20 p-6 rounded-lg border border-brand-medium/30">
              <p className="text-brand-darkest font-medium">
                Cảm ơn bạn đã tin tưởng Futeccons Shop. Chúng tôi cam kết bảo vệ thông tin 
                cá nhân của bạn và sử dụng dữ liệu một cách có trách nhiệm để cung cấp 
                dịch vụ tốt nhất.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 