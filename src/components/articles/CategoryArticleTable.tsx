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
      draft: <Badge variant="outline" className="border-brand-medium text-brand-medium">Nháp</Badge>,
      published: <Badge className="bg-brand-medium hover:bg-brand-medium/90">Đã xuất bản</Badge>,
      archived: <Badge variant="secondary" className="bg-brand-light text-brand-darkest">Đã lưu trữ</Badge>,
    };
    
    return variants[status] || null;
  };

  return (
    <div className="rounded-md border border-brand-light">
      <Table>
        <TableHeader>
          <TableRow className="bg-brand-light/20">
            <TableHead className="w-[180px] text-brand-dark font-semibold">Trạng thái</TableHead>
            <TableHead className="text-brand-dark font-semibold">Tên danh mục</TableHead>
            <TableHead className="text-brand-dark font-semibold">Đường dẫn</TableHead>
            <TableHead className="text-brand-dark font-semibold">Cập nhật lần cuối</TableHead>
            <TableHead className="text-right text-brand-dark font-semibold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-brand-light/10">
              <TableCell>
                {category.hasArticle 
                  ? getStatusBadge(category.articleStatus)
                  : <Badge variant="destructive" className="bg-brand-darkest hover:bg-brand-darkest/90">Chưa có</Badge>
                }
              </TableCell>
              <TableCell>
                <div className="font-medium text-brand-darkest">{category.name}</div>
                <div className="text-sm text-brand-dark">
                  Level {category.level}
                </div>
              </TableCell>
              <TableCell className="text-brand-dark">{category.path}</TableCell>
              <TableCell className="text-brand-dark">
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
                      className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteArticle(category)}
                      className="border-brand-darkest text-brand-darkest hover:bg-brand-darkest hover:text-white"
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
                    className="border-brand-medium text-brand-medium hover:bg-brand-medium hover:text-white"
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