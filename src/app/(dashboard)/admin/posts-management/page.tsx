"use server"
import { getInactivePosts, InactivePostWithUserAndImages } from "@/lib/queries/postQueries";
import { PaginationParams, PaginatedResult } from "@/lib/queries/paginateQuery";
import PostsManagementClientUI from "@/components/admin/posts-management/PostsManagementClientUI";
import { Suspense } from "react";


type PostsManagementPageProps = {
  params?: Promise<{
    postId: string | any 
  }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>
}

const DEFAULT_PAGE_SIZE = 10; // Consistent with getInactivePosts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function PostsManagementPage({ params, searchParams }: PostsManagementPageProps) {
  const { page: pageString, pageSize: pageSizeString, sortBy: sortByString, sortOrder: sortOrderString } = await searchParams;
  const page = pageString ? parseInt(pageString, 10) : 1;
  const pageSize = pageSizeString ? parseInt(pageSizeString, 10) : DEFAULT_PAGE_SIZE;
  const sortBy = sortByString;
  const sortOrder = sortOrderString;

  const paginationParams: PaginationParams = {
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
    sortBy,
    sortOrder,
  };

  // Fetch inactive posts with their images
  const paginatedPostsData: PaginatedResult<InactivePostWithUserAndImages> = await getInactivePosts(paginationParams);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Duyệt bài đăng</h1>
      <Suspense fallback={<div>Đang tải danh sách bài viết...</div>}>
        <PostsManagementClientUI paginatedPosts={paginatedPostsData} />
      </Suspense>
    </div>
  );
} 