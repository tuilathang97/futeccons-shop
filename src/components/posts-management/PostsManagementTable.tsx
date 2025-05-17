'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PostsManagementTableProps } from "./types";
import { Badge } from "@/components/ui/badge";

export default function PostsManagementTable({ posts, onApprove, onDelete, isPending }: PostsManagementTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tiêu đề bài viết</TableHead>
          <TableHead>Người đăng</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>{post.tieuDeBaiViet}</TableCell>
            <TableCell>{post.user?.name || post.userId || 'Không rõ'}</TableCell>
            <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={post.active ? "default" : "secondary"}>
                {post.active ? "Đã duyệt" : "Chờ duyệt"}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onApprove(post.id)} 
                disabled={isPending || post.active}
              >
                Duyệt
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(post.id)} 
                disabled={isPending}
              >
                Xóa
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 