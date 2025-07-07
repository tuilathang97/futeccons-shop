import React from 'react';
import { Home, Users, Star } from 'lucide-react';

const RealEstateSEOSection = () => {

  const propertyTypes = [
    { name: "Nhà riêng", href: "/ban-nha" },
    { name: "Chung cư", href: "/ban-chung-cu" }, 
    { name: "Biệt thự", href: "/ban-biet-thu" },
    { name: "Shophouse", href: "/ban-shophouse" },
    { name: "Nhà mặt phố", href: "/ban-nha-mat-pho" },
    { name: "Đất nền", href: "/ban-dat" }
  ];

  const faqs = [
    {
      question: "Làm thế nào để tìm kiếm bất động sản phù hợp?",
      answer: "Hãy xác định rõ nhu cầu về vị trí, diện tích, ngân sách và mục đích sử dụng. Sử dụng bộ lọc tìm kiếm của chúng tôi để thu hẹp kết quả theo tiêu chí mong muốn."
    },
    {
      question: "Tôi có thể tin tưởng vào thông tin trên website không?",
      answer: "Tất cả thông tin được kiểm duyệt kỹ lưỡng bởi đội ngũ chuyên nghiệp. Chúng tôi chỉ hợp tác với các đối tác uy tín và cập nhật thông tin thường xuyên."
    },
    {
      question: "Chi phí dịch vụ môi giới như thế nào?",
      answer: "Phí môi giới được tính theo tỷ lệ % giá trị giao dịch, minh bạch và cạnh tranh. Chúng tôi cam kết không phát sinh chi phí ẩn."
    }
  ];

  return (
    <section className="container 2xl:px-0 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-brand-medium mb-4">
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Chuyên gia bất động sản</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-darkest mb-4 md:mb-6 font-montserrat leading-tight">
            Nền Tảng Bất Động Sản Hàng Đầu Việt Nam
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed">
            Khám phá hàng ngàn cơ hội đầu tư bất động sản với thông tin chính xác, cập nhật 24/7 và dịch vụ tư vấn chuyên nghiệp từ đội ngũ môi giới kinh nghiệm.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column */}
          <div className="space-y-8 md:space-y-10">
            {/* Main Content */}
            <article className="prose prose-gray max-w-none">
              <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-700 mb-4 md:mb-6">
                <strong className="text-brand-darkest">Fuland Shop</strong> tự hào là nền tảng bất động sản trực tuyến uy tín, 
                cung cấp thông tin về hàng chục nghìn dự án <em>nhà đất, chung cư, biệt thự</em> trên toàn quốc. 
                Với hơn 10 năm kinh nghiệm trong lĩnh vực <strong>môi giới bất động sản</strong>, chúng tôi cam kết 
                mang đến dịch vụ tốt nhất cho khách hàng.
              </p>

              <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4 md:mb-6">
                Đội ngũ <strong>chuyên gia tư vấn bất động sản</strong> của chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc 
                <em>tìm kiếm, đánh giá và thực hiện giao dịch</em> một cách an toàn, minh bạch. Từ việc phân tích thị trường, 
                định giá tài sản đến hỗ trợ pháp lý, chúng tôi đồng hành cùng bạn trong mọi quyết định đầu tư.
              </p>

              <p className="text-sm md:text-base leading-relaxed text-gray-700">
                Hệ thống <strong>tìm kiếm thông minh</strong> cho phép bạn lọc theo nhiều tiêu chí như vị trí, giá cả, diện tích, 
                loại hình bất động sản. Tất cả thông tin được <em>cập nhật real-time</em> và kiểm duyệt nghiêm ngặt, 
                đảm bảo tính chính xác và đáng tin cậy cao nhất.
              </p>
            </article>
          </div>

          {/* Right Column */}
          <div className="space-y-8 md:space-y-10">
            {/* Property Types */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-darkest mb-4 md:mb-6 flex items-center gap-2">
                <Home className="h-5 w-5 md:h-6 md:w-6 text-brand-medium" />
                Loại Hình Bất Động Sản
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {propertyTypes.map((type, index) => (
                  <a 
                    key={index}
                    href={type.href}
                    className="group flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:border-brand-medium hover:bg-brand-light/5 transition-all duration-300"
                  >
                    <div className="w-2 h-2 bg-brand-medium rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-sm md:text-base text-gray-700 group-hover:text-brand-darkest font-medium">
                      {type.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-darkest flex items-center gap-2">
                <Star className="h-5 w-5 md:h-6 md:w-6 text-brand-medium" />
                Câu Hỏi Thường Gặp
              </h3>
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <span className="text-sm md:text-base font-semibold text-brand-darkest group-open:text-brand-medium">
                      {faq.question}
                    </span>
                  </summary>
                  <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-brand-medium to-brand-darkest text-white rounded-xl p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
                Liên Hệ Tư Vấn
              </h3>
              <p className="text-xs md:text-sm opacity-90 mb-4 md:mb-6 leading-relaxed">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí 24/7. 
                Hãy liên hệ ngay để được hỗ trợ tốt nhất.
              </p>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <div>
                  <strong>Hotline:</strong> 1900-1234 (miễn phí)
                </div>
                <div>
                  <strong>Email:</strong> info@futeccons.com
                </div>
                <div>
                  <strong>Giờ làm việc:</strong> 24/7 - Cả tuần
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto">
              <strong className="text-brand-darkest">Fuland Shop</strong> - Nơi hội tụ của những cơ hội đầu tư bất động sản tiềm năng. 
              Với cam kết mang đến <em>dịch vụ chuyên nghiệp, thông tin chính xác và hỗ trợ tận tâm</em>, 
              chúng tôi là đối tác tin cậy cho mọi giao dịch bất động sản của bạn. 
              Hãy khám phá ngay hàng nghìn tin đăng chất lượng và tìm thấy ngôi nhà mơ ước của mình.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateSEOSection; 