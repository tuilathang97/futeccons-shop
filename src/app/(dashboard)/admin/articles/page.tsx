import { getCategoriesWithArticleStatus } from '@/lib/queries/articleQueries';
import ArticleCategoriesClientUI from '@/components/articles/ArticleCategoriesClientUI';
import { CategoryWithArticleStatus } from '@/components/articles/types';

export const metadata = {
  title: 'Quản lý bài viết - Admin',
  description: 'Quản lý bài viết theo danh mục',
};

export default async function ArticlesAdminPage() {
  const categoriesWithStatus = await getCategoriesWithArticleStatus();

  return (
    <div className="container py-10">
      <ArticleCategoriesClientUI 
        initialCategories={categoriesWithStatus as CategoryWithArticleStatus[]} 
      />
    </div>
  );
} 