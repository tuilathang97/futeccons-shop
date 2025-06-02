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
    <div className="rounded-md border border-brand-light overflow-x-auto">
      <Table>
        <TableCaption className="text-brand-dark">Danh sách các danh mục hiện có.</TableCaption>
        <TableHeader>
          <TableRow className="bg-brand-light/20">
            <TableHead className="w-[60px] text-brand-dark font-semibold">ID</TableHead>
            <TableHead className="text-brand-dark font-semibold">Tên danh mục</TableHead>
            <TableHead className="text-brand-dark font-semibold">Ghi chú</TableHead>
            <TableHead className="text-brand-dark font-semibold">Cấp</TableHead>
            <TableHead className="text-brand-dark font-semibold">Danh mục cha</TableHead>
            <TableHead className="text-brand-dark font-semibold">Slug</TableHead>
            <TableHead className="text-brand-dark font-semibold">Path</TableHead>
            <TableHead className="text-right text-brand-dark font-semibold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-brand-dark">
                Không có danh mục nào.
              </TableCell>
            </TableRow>
          )}
          {categories.map((category) => {
            const parentCategory = categories.find(c => c.id === category.parentId);
            const formattedPath = formatPath(category.path);
            
            return (
              <TableRow key={category.id} className="hover:bg-brand-light/10">
                <TableCell className="font-medium text-brand-darkest">{category.id}</TableCell>
                <TableCell className="font-medium text-brand-darkest">{category.name}</TableCell>
                <TableCell className="text-brand-dark">{category.note || '-'}</TableCell>
                <TableCell className="text-brand-dark">Cấp {category.level}</TableCell>
                <TableCell className="text-brand-dark">{parentCategory ? `${parentCategory.name} (${parentCategory.path || '-'})` : '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate text-brand-dark" title={category.slug || '-'}>{category.slug || '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {formattedPath ? (
                    <Link 
                      href={formattedPath} 
                      target="_blank" 
                      className="flex items-center text-brand-medium hover:underline hover:text-brand-dark gap-1"
                      title={formattedPath}
                    >
                      {formattedPath} 
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-brand-dark">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(category)}
                    className="text-brand-dark hover:text-brand-medium hover:bg-brand-light/20"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Sửa</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(category)}
                    className="text-brand-darkest hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
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