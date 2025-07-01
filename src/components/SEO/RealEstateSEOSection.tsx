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
          <strong className="text-gray-900 dark:text-white mx-2 ">Futeccons Shop</strong>
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

      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Câu hỏi thường gặp</h3>
      <div className="space-y-4 mb-8">
        <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
            Làm thế nào để đăng tin miễn phí?
          </summary>
          <p className="p-4 pt-0 text-gray-700 dark:text-gray-300">
            Bạn chỉ cần tạo tài khoản, sau đó vào mục &quot;Đăng tin&quot; và điền đầy đủ thông tin về bất động sản của bạn. Tin đăng sẽ được duyệt trong vòng 24 giờ.
          </p>
        </details>
        <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
            Có cần trả phí để xem thông tin liên hệ?
          </summary>
          <p className="p-4 pt-0 text-gray-700 dark:text-gray-300">
            Không. Tất cả người dùng đều có thể xem thông tin liên hệ của người đăng tin hoàn toàn miễn phí.
          </p>
        </details>
        <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
            Làm sao để tìm nhà đất theo khu vực cụ thể?
          </summary>
          <p className="p-4 pt-0 text-gray-700 dark:text-gray-300">
            Bạn có thể sử dụng bộ lọc hoặc truy cập trực tiếp vào các danh mục khu vực như Quận 1, Quận 7, Thủ Đức... để xem danh sách bất động sản tương ứng.
          </p>
        </details>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Liên kết nội bộ</h3>
      <ul className="flex flex-wrap gap-4 mb-8">
        <li><Link href="/nha-dat-ban" className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Mua bán nhà đất</Link></li>
        <li><Link href="/nha-cho-thue" className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cho thuê căn hộ</Link></li>
        <li><Link href="/tin-tuc" className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Tin tức bất động sản</Link></li>
        <li><Link href="/lien-he" className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Liên hệ</Link></li>
      </ul>

      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Thông tin liên hệ</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM<br />
          <strong className="text-gray-900 dark:text-white">Hotline:</strong> 0909xxxxxx<br />
          <strong className="text-gray-900 dark:text-white">Email:</strong> info@website.com
        </p>
      </div>
    </section>
  );
};

export default RealEstateSEOSection;
