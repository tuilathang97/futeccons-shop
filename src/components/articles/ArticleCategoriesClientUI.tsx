'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import CategoryArticleTable from './CategoryArticleTable';
import { createArticleAction, updateArticleAction, deleteArticleAction, getCategoriesWithArticleStatusAction, getArticleForEditAction } from '@/actions/articleActions';
import { CategoryWithArticleStatus } from './types';
import CreateArticleModal from './CreateArticleModal';
import { Article, Category } from '@/db/schema';

interface ArticleCategoriesClientUIProps {
  initialCategories: CategoryWithArticleStatus[];
}

export default function ArticleCategoriesClientUI({ initialCategories }: ArticleCategoriesClientUIProps) {
  const [categories, setCategories] = useState<CategoryWithArticleStatus[]>(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]); // For dropdown options
  
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateArticle = (category: CategoryWithArticleStatus) => {
    setSelectedArticle(null);
    setAllCategories([]);
    
    const categoryData: Category = {
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      level: category.level,
      note: category.note || null,
      path: category.path,
      slug: category.slug
    };
    
    setSelectedCategory(categoryData);
    setIsModalOpen(true);
  };

  const handleEditArticle = (category: CategoryWithArticleStatus) => {
    if (!category.articleId) return;
    
    // First reset any existing data
    setSelectedCategory(null);
    setSelectedArticle(null);
    setAllCategories([]);
    
    startTransition(async () => {
      const result = await getArticleForEditAction(category.articleId!);
      
      if (result.success && result.data && typeof result.data === 'object' && 'categories' in result.data && 'article' in result.data) {
        // Store the full categories list for dropdowns
        setAllCategories(result.data.categories as Category[]);
        
        // Set the article for editing
        setSelectedArticle(result.data.article as Article);
        setIsModalOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.message || "Không thể tải dữ liệu bài viết"
        });
      }
    });
  };

  const handleDeleteArticle = async (category: CategoryWithArticleStatus) => {
    if (!category.articleId) return;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      return;
    }
    
    startTransition(async () => {
      const result = await deleteArticleAction(category.articleId!);
      
      if (result.success) {
        toast({ title: "Thành công", description: result.message });
        
        if (result.data) {
          setCategories(result.data as CategoryWithArticleStatus[]);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.message || "Đã xảy ra lỗi"
        });
      }
      
      router.refresh();
    });
  };

  const handleCreateNew = () => {
    // Reset all state before opening modal for a new article
    setSelectedCategory(null);
    setSelectedArticle(null);
    setAllCategories([]);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = formData.get('id') 
          ? await updateArticleAction(formData)
          : await createArticleAction(formData);
        
        if (result.success) {
          toast({ title: "Thành công", description: result.message });
          setCategories(result.data as CategoryWithArticleStatus[]);

          setIsModalOpen(false);
          setSelectedArticle(null);
          setSelectedCategory(null);
          setAllCategories([]);
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.message || "Đã xảy ra lỗi"
          });
        }
      } catch (error) {
        console.error('Error submitting article:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi xử lý bài viết"
        });
      }
    });
  };

  const refreshData = async () => {
    startTransition(async () => {
      try {
        const result = await getCategoriesWithArticleStatusAction();
        
        if (result.success) {
          toast({ title: "Thành công", description: result.message });
          
          if (result.data) {
            setCategories(result.data as CategoryWithArticleStatus[]);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.message || "Đã xảy ra lỗi"
          });
        }
        
        router.refresh();
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi làm mới dữ liệu",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Quản lý bài viết theo danh mục</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isPending}
            className="border-brand-dark text-brand-dark hover:bg-brand-light hover:text-brand-darkest"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button 
            onClick={handleCreateNew} 
            disabled={isPending}
            className="bg-brand-medium hover:bg-brand-medium/90 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo bài viết mới
          </Button>
        </div>
      </div>

      <CategoryArticleTable
        categories={categories}
        onCreateArticle={handleCreateArticle}
        onEditArticle={handleEditArticle}
        onDeleteArticle={handleDeleteArticle}
      />

      <CreateArticleModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArticle(null);
            setSelectedCategory(null);
            setAllCategories([]);
          }
          setIsModalOpen(open);
        }}
        categories={allCategories.length > 0 ? allCategories : categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          parentId: cat.parentId,
          level: cat.level,
          note: cat.note,
          path: cat.path,
          slug: cat.slug
        }))}
        selectedCategory={selectedCategory}
        article={selectedArticle}
        onSubmit={handleModalSubmit}
        isPending={isPending}
      />
    </div>
  );
} 