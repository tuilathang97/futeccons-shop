import { Metadata } from 'next';
import { getAllNews } from '@/lib/news';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tin tức bất động sản - Cập nhật thông tin thị trường mới nhất',
  description: 'Tin tức bất động sản Việt Nam mới nhất 2025: Luật Đất đai, sáp nhập tỉnh thành, thuế BĐS, giá cả thị trường và xu hướng đầu tư.',
  keywords: 'tin tức bất động sản, thị trường BĐS, Luật Đất đai 2024, sáp nhập tỉnh thành, thuế BĐS, giá nhà đất 2025',
};

export default async function TinTucPage() {
  const allNews = await getAllNews();

  return (
    <div className="  py-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Tin tức bất động sản</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Cập nhật thông tin mới nhất về thị trường bất động sản Việt Nam, xu hướng đầu tư và các quy định pháp lý.
        </p>
      </header>

              {/* News Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Tin tức mới nhất 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.map((news) => (
            <article key={news.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link 
                    href={`/tin-tuc/${news.slug}`}
                    className="hover:underline transition-colors"
                  >
                    {news.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {news.description}
                </p>
                <div className="text-sm text-gray-500">
                  <time dateTime={news.date}>
                    {new Date(news.date).toLocaleDateString('vi-VN')}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
} 