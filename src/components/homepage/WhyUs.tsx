import { Shield, Users, Award, Clock } from 'lucide-react'
import React from 'react'

const whyUsData = [
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />,
    title: 'Uy tín & Tin cậy',
    description: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực bất động sản, chúng tôi cam kết mang đến dịch vụ uy tín và đáng tin cậy nhất cho khách hàng.',
  },
  {
    icon: <Users className="w-12 h-12 text-green-600" />,
    title: 'Đội ngũ chuyên nghiệp',
    description: 'Đội ngũ tư vấn viên giàu kinh nghiệm, được đào tạo bài bản và luôn sẵn sàng hỗ trợ khách hàng tìm được căn nhà mơ ước.',
  },
  {
    icon: <Award className="w-12 h-12 text-yellow-600" />,
    title: 'Chất lượng hàng đầu',
    description: 'Được công nhận là đơn vị bất động sản hàng đầu với nhiều giải thưởng uy tín và sự tin tưởng của hàng nghìn khách hàng.',
  },
  {
    icon: <Clock className="w-12 h-12 text-purple-600" />,
    title: 'Hỗ trợ 24/7',
    description: 'Dịch vụ hỗ trợ khách hàng 24/7, luôn sẵn sàng giải đáp mọi thắc mắc và đồng hành cùng bạn trong suốt quá trình giao dịch.',
  },
]

export default function WhyUs() {
  return (
    <div 
      style={{ backgroundImage: "url('/images/backgroundImage.webp')", backgroundSize: "cover" }} 
      className='min-w-full py-16 xl:rounded-lg relative'
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 xl:rounded-lg"></div>
      
      <div className='relative z-10 container mx-auto 2xl:px-0'>
        {/* Main heading */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Tại sao chọn chúng tôi?
          </h2>
          <p className='text-lg md:text-xl text-white/90 max-w-3xl mx-auto'>
            Chúng tôi tự hào là đối tác tin cậy của bạn trong mọi giao dịch bất động sản
          </p>
        </div>

        {/* Why us cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {whyUsData.map((item, index) => (
            <div key={index} className='bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <div className='flex flex-col items-center text-center'>
                <div className='mb-4'>
                  {item.icon}
                </div>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                  {item.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}