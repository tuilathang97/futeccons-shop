import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNewsBySlug, getRelatedNews, getAllNews } from '@/lib/news';
import Link from 'next/link';

interface NewsPageProps {
  params: Promise<{ newsId: string }>;
}
export async function generateStaticParams() {
  const allNews = await getAllNews();
  return allNews.map((news) => ({
    newsId: news.slug,
  }));
}

// Generate metadata cho SEO
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { newsId } = await params;
  const post = await getNewsBySlug(newsId);
  
  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
      url: post.url,
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { newsId } = await params;
  const post = await getNewsBySlug(newsId);
  
  if (!post) {
    notFound();
  }
  
  const relatedNews = await getRelatedNews(newsId);
  const Content = post.content;

  return (
    <div className="py-4">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/tin-tuc" className="hover:text-blue-600">Tin tức</Link>
        <span className="mx-2">/</span>
        <span>{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>Tác giả: {post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        {Content && <Content />}
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Tin tức liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((news) => (
              <article key={news.slug} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    <Link 
                      href={`/tin-tuc/${news.slug}`}
                      className="hover:text-blue-600"
                    >
                      {news.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {news.description}
                  </p>
                  <time className="text-xs text-gray-500 mt-2 block">
                    {new Date(news.date).toLocaleDateString('vi-VN')}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}