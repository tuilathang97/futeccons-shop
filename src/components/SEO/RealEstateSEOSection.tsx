import Link from 'next/link';

const RealEstateSEOSection = () => {
  return (
    <section className="border-t border-t-gray-200 py-12 bg-white dark:bg-gray-900">
      <h2 className="text-3xl flex justify-center items-center font-bold font-montserrat text-gray-900 dark:text-white mb-6">
        Mua bán nhà đất, cho thuê bất động sản tại TP.HCM
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Chào mừng bạn đến với 
        <Link href="/" className="text-gray-900 dark:text-white hover:text-brand-medium hover:underline">
          <strong className="text-gray-900 dark:text-white mx-2 "> Fuland Shop</strong>
        </Link> 
        – nền tảng giao dịch bất động sản uy tín tại TP.HCM và các tỉnh lân cận. Chúng tôi cung cấp thông tin chính xác, cập nhật về mua bán nhà đất, cho thuê căn hộ, nhà phố, đất nền và nhiều loại hình bất động sản khác.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
      Chúng tôi cung cấp đa dạng lựa chọn từ căn hộ, nhà phố đến mặt bằng kinh doanh tại các khu vực trung tâm thành phố. Mỗi bất động sản đều đảm bảo tiện nghi hiện đại, an ninh tốt và gần các tiện ích như trường học, chợ, bệnh viện. Đặc biệt, giá thuê cạnh tranh, phù hợp với mọi nhu cầu. Liên hệ ngay để được tư vấn và xem trực tiếp bất động sản bạn quan tâm!
      </p>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hướng dẫn sử dụng</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Bạn có thể dễ dàng tìm kiếm bất động sản phù hợp bằng cách sử dụng bộ lọc theo loại hình (nhà phố, căn hộ, đất nền...), mức giá, diện tích và khu vực. Để đăng tin miễn phí, hãy đăng ký tài khoản và làm theo hướng dẫn chi tiết trên trang &quot;Đăng tin&quot;.
      </p>

      
    </section>
  );
};

export default RealEstateSEOSection;
