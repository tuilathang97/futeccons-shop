'use client';

import { type Category } from '@/db/schema';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatPath } from '@/lib/utils';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({ 
  categories,
  onEdit,
  onDelete
}: CategoryTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableCaption>Danh sách các danh mục hiện có.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Cấp</TableHead>
            <TableHead>Danh mục cha</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Path</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Không có danh mục nào.
              </TableCell>
            </TableRow>
          )}
          {categories.map((category) => {
            const parentCategory = categories.find(c => c.id === category.parentId);
            const formattedPath = formatPath(category.path);
            
            return (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.note || '-'}</TableCell>
                <TableCell>Cấp {category.level}</TableCell>
                <TableCell>{parentCategory ? `${parentCategory.name} (${parentCategory.path || '-'})` : '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={category.slug || '-'}>{category.slug || '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {formattedPath ? (
                    <Link 
                      href={formattedPath} 
                      target="_blank" 
                      className="flex items-center text-blue-600 hover:underline hover:text-blue-800 gap-1"
                      title={formattedPath}
                    >
                      {formattedPath} 
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Sửa</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 