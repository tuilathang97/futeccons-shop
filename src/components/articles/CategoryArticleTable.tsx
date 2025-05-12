import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, FilePlus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { type ReactNode } from 'react';
import { CategoryWithArticleStatus } from './types';

interface CategoryArticleTableProps {
  categories: CategoryWithArticleStatus[];
  onCreateArticle: (category: CategoryWithArticleStatus) => void;
  onEditArticle: (category: CategoryWithArticleStatus) => void;
  onDeleteArticle: (category: CategoryWithArticleStatus) => void;
}

export default function CategoryArticleTable({
  categories,
  onCreateArticle,
  onEditArticle,
  onDeleteArticle,
}: CategoryArticleTableProps) {
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const variants: Record<string, ReactNode> = {
      draft: <Badge variant="outline">Nháp</Badge>,
      published: <Badge>Đã xuất bản</Badge>,
      archived: <Badge variant="secondary">Đã lưu trữ</Badge>,
    };
    
    return variants[status] || null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Trạng thái</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead>Cập nhật lần cuối</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.hasArticle 
                  ? getStatusBadge(category.articleStatus)
                  : <Badge variant="destructive">Chưa có</Badge>
                }
              </TableCell>
              <TableCell>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">
                  Level {category.level}
                </div>
              </TableCell>
              <TableCell>{category.path}</TableCell>
              <TableCell>
                {category.lastUpdated 
                  ? formatDate(category.lastUpdated)
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {category.hasArticle ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditArticle(category)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteArticle(category)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCreateArticle(category)}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Tạo bài viết
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 