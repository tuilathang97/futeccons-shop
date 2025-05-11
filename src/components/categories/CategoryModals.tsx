'use client';

import { type Category } from '@/db/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CategoryForm from './CategoryForm';
import { CategorySchema } from './categorySchema';
import { z } from 'zod';

type CategoryFormData = z.infer<typeof CategorySchema>;

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

interface CreateCategoryModalProps extends ModalProps {
  onSubmit: (data: CategoryFormData) => void;
  isPending: boolean;
}

export function CreateCategoryModal({ 
  open, 
  onOpenChange,
  categories,
  onSubmit,
  isPending
}: CreateCategoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo danh mục mới</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho danh mục mới. Nhấn &apos;Lưu&apos; để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          categories={categories}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditCategoryModalProps extends ModalProps {
  selectedCategory: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  isPending: boolean;
}

export function EditCategoryModal({
  open,
  onOpenChange,
  categories,
  selectedCategory,
  onSubmit,
  isPending
}: EditCategoryModalProps) {
  if (!selectedCategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin danh mục. Nhấn &apos;Lưu&apos; để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          categories={categories}
          onSubmit={onSubmit}
          isPending={isPending}
          selectedId={selectedCategory.id}
          defaultValues={{
            name: selectedCategory.name,
            parentId: selectedCategory.parentId?.toString(),
            note: selectedCategory.note || "",
            slug: selectedCategory.slug || "",
            path: selectedCategory.path || "",
            level: selectedCategory.level
          }}
          submitLabel="Lưu thay đổi"
        />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteCategoryModalProps extends ModalProps {
  selectedCategory: Category | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteCategoryModal({
  open,
  onOpenChange,
  selectedCategory,
  onConfirm,
  isPending
}: DeleteCategoryModalProps) {
  if (!selectedCategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục &quot;{selectedCategory.name}&quot;? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>Hủy</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 