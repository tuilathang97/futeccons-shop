'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { approvePostAction, deletePostAction } from '@/actions/postActions';
import { PaginatedResult } from '@/lib/queries/paginateQuery';
import { InactivePostWithUserAndImages } from '@/lib/queries/postQueries';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

interface PostsManagementClientUIProps {
  paginatedPosts: PaginatedResult<InactivePostWithUserAndImages>;
}

export default function PostsManagementClientUI({
  paginatedPosts,
}: PostsManagementClientUIProps) {
  const [posts, setPosts] = useState<InactivePostWithUserAndImages[]>(paginatedPosts.data);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { currentPage, totalPages, pageSize } = paginatedPosts.metadata;

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams();
    currentParams.set('page', String(newPage));
    currentParams.set('pageSize', String(pageSize));
    router.push(`/admin/posts-management?${currentParams.toString()}`);
  };

  const handleApprove = async (postId: number) => {
    startTransition(async () => {
      const result = await approvePostAction(postId);
      if (result.success) {
        toast({ title: 'Thành công', description: result.message });
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        router.refresh(); 
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: result.message || 'Phê duyệt bài viết thất bại.',
        });
      }
    });
  };

  const handleDelete = async (postId: number) => {
    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (result.success) {
        toast({ title: 'Thành công', description: result.message });
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
         router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: result.message || 'Xóa bài viết thất bại.',
        });
      }
    });
  };

  const handlePreview = (post: InactivePostWithUserAndImages) => {
    window.open(`/admin/posts-management/preview/${post.id}`, '_blank');
  };
  
  const getUserName = (post: InactivePostWithUserAndImages) => {
    return post.user?.name || post.user?.email || 'N/A';
  }

  return (
    <div className="w-full space-y-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-brand-light/20">
            <TableHead className="text-brand-dark font-semibold">Tiêu đề</TableHead>
            <TableHead className="text-brand-dark font-semibold">Người đăng</TableHead>
            <TableHead className="text-brand-dark font-semibold">Ngày tạo</TableHead>
            <TableHead className="text-right text-brand-dark font-semibold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-brand-light/10">
                <TableCell className="font-medium text-brand-darkest">{post.tieuDeBaiViet}</TableCell>
                <TableCell className="text-brand-dark">{getUserName(post)}</TableCell>
                <TableCell className="text-brand-dark">{formatDate(post.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(post)}
                    disabled={isPending}
                    className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
                    asChild
                  >
                    <Link href={`/admin/posts-management/preview/${post.id}`} target="_blank">
                      Xem trước
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApprove(post.id)}
                    disabled={isPending}
                    className="text-brand-medium hover:text-white hover:bg-brand-medium"
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={isPending}
                    className="bg-brand-darkest hover:bg-brand-darkest/90"
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-brand-dark">
                Không có bài viết nào chờ duyệt.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                aria-disabled={currentPage <= 1}
                className={`${currentPage <= 1 ? "pointer-events-none opacity-50" : "text-brand-dark hover:bg-brand-light hover:text-brand-darkest"}`}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                    className={currentPage === pageNum 
                      ? "bg-brand-medium text-white hover:bg-brand-medium/90" 
                      : "text-brand-dark hover:bg-brand-light hover:text-brand-darkest"
                    }
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                aria-disabled={currentPage >= totalPages}
                className={`${currentPage >= totalPages ? "pointer-events-none opacity-50" : "text-brand-dark hover:bg-brand-light hover:text-brand-darkest"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 