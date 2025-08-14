import { NewsMetadata, NewsPost } from '@/types/news';

// Type cho MDX module có metadata
interface MDXModule {
  default: React.ComponentType;
  metadata: NewsMetadata;
}

// Import tất cả các bài viết tin tức
const newsModules = {
  'luat-dat-dai-2024-co-hieu-luc': () => import('@/news/posts/luat-dat-dai-2024-co-hieu-luc.mdx') as Promise<MDXModule>,
  'sap-nhap-tphcm-binh-duong-vung-tau': () => import('@/news/posts/sap-nhap-tphcm-binh-duong-vung-tau.mdx') as Promise<MDXModule>,
  'thue-bat-dong-san-20-phan-tram': () => import('@/news/posts/thue-bat-dong-san-20-phan-tram.mdx') as Promise<MDXModule>,
  'gia-bat-dong-san-2025-tang-5-8-phan-tram': () => import('@/news/posts/gia-bat-dong-san-2025-tang-5-8-phan-tram.mdx') as Promise<MDXModule>,
  'ma-bat-dong-san-soi-dong-2025': () => import('@/news/posts/ma-bat-dong-san-soi-dong-2025.mdx') as Promise<MDXModule>,
  'goi-145000-ty-nha-o-xa-hoi': () => import('@/news/posts/goi-145000-ty-nha-o-xa-hoi.mdx') as Promise<MDXModule>,
  'bong-bong-bat-dong-san-2025': () => import('@/news/posts/bong-bong-bat-dong-san-2025.mdx') as Promise<MDXModule>,
  'bat-dong-san-2025':() => import('@/news/posts/bat-dong-san-2025.mdx') as Promise<MDXModule>,
  'chung-cu-gia-re-duoi-2-5-ty-tphcm-thang-8-2025':() => import('@/news/posts/chung-cu-gia-re-duoi-2-5-ty-tphcm-thang-8-2025.mdx') as Promise<MDXModule>,
};

// Lấy tất cả metadata của các bài viết
export async function getAllNews(): Promise<NewsMetadata[]> {
  const newsList: NewsMetadata[] = [];
  
  for (const [slug, importFn] of Object.entries(newsModules)) {
    try {
      const functionImport = await importFn();
      if (functionImport.metadata) {
        newsList.push({
          ...functionImport.metadata,
          slug
        });
      }
    } catch (error) {
      console.error(`Error loading news ${slug}:`, error);
    }
  }
  
  // Sắp xếp theo ngày mới nhất
  return newsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Lấy một bài viết theo slug
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const importFn = newsModules[slug as keyof typeof newsModules];
  
  if (!importFn) {
    return null;
  }
  
  try {
    const functionImport = await importFn();
    return {
      ...functionImport.metadata,
      slug,
      content: functionImport.default
    };
  } catch (error) {
    console.error(`Error loading news ${slug}:`, error);
    return null;
  }
}

// Lấy các bài viết liên quan (cùng từ khóa)
export async function getRelatedNews(currentSlug: string, limit: number = 3): Promise<NewsMetadata[]> {
  const allNews = await getAllNews();
  return allNews
    .filter(news => news.slug !== currentSlug)
    .slice(0, limit);
} 