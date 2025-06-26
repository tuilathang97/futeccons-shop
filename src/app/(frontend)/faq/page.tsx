import { FaqSection, FaqItem } from '@/components/blocks/faq';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: "Làm thế nào để đăng tin bất động sản?",
      answer: "Để đăng tin, bạn cần đăng nhập vào tài khoản, sau đó nhấn nút 'Đăng tin' ở góc phải màn hình. Điền đầy đủ thông tin bất động sản và tải lên hình ảnh chất lượng cao."
    },
    {
      question: "Tôi có thể đăng bao nhiêu tin miễn phí?",
      answer: "Hiện tại, mỗi tài khoản có thể đăng không giới hạn tin miễn phí. Chúng tôi khuyến khích đăng tin chất lượng với thông tin chính xác."
    },
    {
      question: "Làm sao để liên hệ với chủ nhà?",
      answer: "Bạn có thể liên hệ với chủ nhà bằng cách nhấn nút 'Liên hệ' trên tin đăng, sau đó chọn gọi điện hoặc gửi tin nhắn. Số điện thoại sẽ hiển thị sau khi bạn nhấn 'Hiện số điện thoại'."
    },
    {
      question: "Tại sao tin đăng của tôi chưa được hiển thị?",
      answer: "Tin đăng sẽ được kiểm duyệt trong vòng 24 giờ sau khi đăng. Hãy đảm bảo thông tin chính xác và hình ảnh phù hợp với quy định của chúng tôi."
    },
    {
      question: "Tôi có thể chỉnh sửa tin đăng sau khi đã đăng không?",
      answer: "Có, bạn có thể chỉnh sửa tin đăng trong phần 'Tài khoản' > 'Quản lý tin đăng'. Sau khi chỉnh sửa, tin sẽ được kiểm duyệt lại."
    },
    {
      question: "Làm thế nào để tìm kiếm bất động sản hiệu quả?",
      answer: "Sử dụng bộ lọc tìm kiếm để thu hẹp kết quả theo vị trí, giá cả, diện tích và loại hình bất động sản. Bạn cũng có thể lưu tìm kiếm để nhận thông báo khi có tin mới phù hợp."
    },
    {
      question: "Tôi có thể xóa tin đăng không?",
      answer: "Có, bạn có thể xóa tin đăng bất cứ lúc nào trong phần 'Quản lý tin đăng' của tài khoản."
    },
    {
      question: "Làm sao để báo cáo tin đăng vi phạm?",
      answer: "Trên mỗi tin đăng có nút 'Báo cáo', bạn có thể sử dụng để báo cáo các tin đăng có thông tin sai lệch, hình ảnh không phù hợp hoặc vi phạm quy định."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Câu hỏi thường gặp
          </h1>
          <p className="text-brand-dark">
            Tìm câu trả lời cho những thắc mắc phổ biến
          </p>
        </div>

        {/* FAQ Section */}
        <FaqSection title="" description="">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                index={index}
              >
                <p>{faq.answer}</p>
              </FaqItem>
            ))}
          </div>
        </FaqSection>
      </div>
    </div>
  );
} 