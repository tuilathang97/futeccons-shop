import { getInactivePosts } from '@/lib/queries/postQueries';
import PostsManagementClientUI from '@/components/posts-management/PostsManagementClientUI';

export const metadata = {
  title: 'Quản lý bài đăng - Admin',
  description: 'Duyệt hoặc xóa bài đăng của người dùng',
};

interface PostsManagementAdminPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

const DEFAULT_PAGE_SIZE = 10;

export default async function PostsManagementAdminPage({ searchParams }: PostsManagementAdminPageProps) {
  const { page: pageString, pageSize: pageSizeString } = await searchParams;

  const page = pageString ? parseInt(pageString, 10) : 1;
  const pageSize = pageSizeString ? parseInt(pageSizeString, 10) : DEFAULT_PAGE_SIZE;

  const paginatedPosts = await getInactivePosts({
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
  });

  return (
    <section className="container py-10">
      <PostsManagementClientUI 
        paginatedPostsData={paginatedPosts} 
      />
    </section>
  );
} 