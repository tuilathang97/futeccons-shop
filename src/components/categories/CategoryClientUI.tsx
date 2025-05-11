'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { type Category } from '@/db/schema';
import { PlusCircle } from 'lucide-react';
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/actions/categoryActions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleActionResult } from '@/lib/utils';
import { CategorySchema } from './categorySchema';
import { z } from 'zod';
import CategoryTable from './CategoryTable';
import { CreateCategoryModal, EditCategoryModal, DeleteCategoryModal } from './CategoryModals';

interface CategoryClientUIProps {
  initialCategories: Category[];
}

type CategoryFormData = z.infer<typeof CategorySchema>;

export default function CategoryClientUI({ initialCategories }: CategoryClientUIProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateSubmit = async (data: CategoryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        const result = await createCategoryAction(formData);
        const updatedCategories = handleActionResult(result, toast, () => {
          setIsCreateModalOpen(false);
        });
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
        router.refresh();
      } catch (error) {
        console.error('Error creating category:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tạo danh mục",
        });
      }
    });
  };

  const handleEditSubmit = async (data: CategoryFormData) => {
    if (!selectedCategory) return;

    const formData = new FormData();
    formData.append('id', String(selectedCategory.id));
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        const result = await updateCategoryAction(formData);
        const updatedCategories = handleActionResult(result, toast, () => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        });
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
        router.refresh();
      } catch (error) {
        console.error('Error updating category:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi cập nhật danh mục",
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    startTransition(async () => {
      try {
        const result = await deleteCategoryAction(selectedCategory.id);
        const updatedCategories = handleActionResult(result, toast, () => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        });
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
        router.refresh();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi xóa danh mục",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo danh mục mới
        </Button>
      </div>

      <CategoryTable
        categories={categories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setIsEditModalOpen(true);
        }}
        onDelete={(category) => {
          setSelectedCategory(category);
          setIsDeleteModalOpen(true);
        }}
      />

      <CreateCategoryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        categories={categories}
        onSubmit={handleCreateSubmit}
        isPending={isPending}
      />

      <EditCategoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onSubmit={handleEditSubmit}
        isPending={isPending}
      />

      <DeleteCategoryModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </div>
  );
} 