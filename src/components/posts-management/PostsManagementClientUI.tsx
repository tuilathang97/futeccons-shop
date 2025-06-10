'use client';

import { useState, useTransition, useEffect } from 'react';
import { PostsManagementClientUIProps, InactivePostWithUser } from "./types";
import PostsManagementTable from "./PostsManagementTable";
import { approvePostAction, deletePostAction } from '@/actions/postActions';
import { useToast } from "@/hooks/use-toast";
import { handleActionResult } from '@/lib/utils/handle-action-result';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from 'next/navigation';

export default function PostsManagementClientUI({ paginatedPostsData }: PostsManagementClientUIProps) {
  const [posts, setPosts] = useState<InactivePostWithUser[]>(paginatedPostsData.data);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentPage, totalPages } = paginatedPostsData.metadata;

  useEffect(() => {
    setPosts(paginatedPostsData.data);
  }, [paginatedPostsData.data]);

  const handleApprove = async (postId: number) => {
    startTransition(async () => {
      const result = await approvePostAction(postId);
      handleActionResult(result, toast, () => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      });
    });
  };

  const handleDelete = async (postId: number) => {
    startTransition(async () => {
      const result = await deletePostAction(postId);
      handleActionResult(result, toast, () => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      });
    });
  };

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('page', String(newPage));
    router.push(`/admin/posts-management?${currentParams.toString()}`);
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý bài đăng chờ duyệt</h1>
      {posts.length === 0 && currentPage === 1 ? (
        <p>Không có bài đăng nào chờ duyệt.</p>
      ) : (
        <PostsManagementTable 
          posts={posts} 
          onApprove={handleApprove} 
          onDelete={handleDelete} 
          isPending={isPending}
        />
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 