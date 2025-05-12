'use client';

import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArticleSchema, type ArticleFormData } from './articleSchema';
import TiptapEditor from './TiptapEditor';
import { Category, Article } from '@/db/schema';

interface CreateArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  selectedCategory?: Category | null;
  article?: Article | null;
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export default function CreateArticleModal({
  open,
  onOpenChange,
  categories,
  selectedCategory,
  article,
  onSubmit,
  isPending
}: CreateArticleModalProps) {
  const level1Categories = categories.filter(c => c.level === 1);
  const [level2Categories, setLevel2Categories] = useState<Category[]>([]);
  const [level3Categories, setLevel3Categories] = useState<Category[]>([]);
  
  const isCreateWithPreselectedCategory = !article && selectedCategory;
  const isEditMode = !!article;
  
  const isCategorySelectionDisabled = isEditMode || isCreateWithPreselectedCategory;

  const getParentCategoryId = (category: Category, allCategories: Category[], targetLevel: number): number | null => {
    if (category.level === targetLevel) return category.id;
    if (category.level < targetLevel) return null;
    
    if (category.level === targetLevel + 1 && category.parentId) {
      return category.parentId;
    }
    
    if (category.level === 3 && targetLevel === 1 && category.parentId) {
      const parentCategory = allCategories.find(c => c.id === category.parentId);
      if (parentCategory?.parentId) {
        return parentCategory.parentId;
      }
    }
    
    return null;
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      content: article?.content || '',
      level1CategoryId: article?.level1CategoryId ? String(article.level1CategoryId) : 
                        (selectedCategory?.level === 1 ? String(selectedCategory.id) : 
                         selectedCategory && selectedCategory.level > 1 && selectedCategory.parentId ? 
                         String(getParentCategoryId(selectedCategory, categories, 1) || '') : ''),
      level2CategoryId: article?.level2CategoryId ? String(article.level2CategoryId) : 
                        (selectedCategory?.level === 2 ? String(selectedCategory.id) : 
                         selectedCategory && selectedCategory.level > 2 && selectedCategory.parentId ? 
                         String(getParentCategoryId(selectedCategory, categories, 2) || '') : ''),
      level3CategoryId: article?.level3CategoryId ? String(article.level3CategoryId) : 
                        (selectedCategory?.level === 3 ? String(selectedCategory.id) : ''),
      targetState: article?.targetState || '',
      targetCity: article?.targetCity || '',
      metaDescription: article?.metaDescription || '',
      metaKeywords: article?.metaKeywords || '',
      status: (article?.status as 'draft' | 'published' | 'archived') || 'draft',
      publishedAt: article?.publishedAt ? article.publishedAt.toISOString() : null,
    }
  });

  const level1Id = form.watch('level1CategoryId');
  const level2Id = form.watch('level2CategoryId');
  const level3Id = form.watch('level3CategoryId');
  const title = form.watch('title');
  const slug = form.watch('slug');

  const generateSlug = useCallback(() => {
    console.log({selectedCategory, article})
    if (selectedCategory?.path || article?.level1CategoryId) {
      const categoryPath = selectedCategory?.path || article?.slug;
      
        console.log({categoryPath })
      if (categoryPath) {
        form.setValue('slug', categoryPath, { shouldValidate: true });
        return;
      }
    }
  }, [form, title, selectedCategory, article, categories]);

  useEffect(() => {
    if (open) {
      form.reset({
        title: article?.title || '',
        slug: article?.slug || '',
        content: article?.content || '',
        level1CategoryId: article?.level1CategoryId ? String(article.level1CategoryId) : 
                        (selectedCategory?.level === 1 ? String(selectedCategory.id) : 
                         selectedCategory && selectedCategory.level > 1 && selectedCategory.parentId ? 
                         String(getParentCategoryId(selectedCategory, categories, 1) || '') : ''),
        level2CategoryId: article?.level2CategoryId ? String(article.level2CategoryId) : 
                        (selectedCategory?.level === 2 ? String(selectedCategory.id) : 
                         selectedCategory && selectedCategory.level > 2 && selectedCategory.parentId ? 
                         String(getParentCategoryId(selectedCategory, categories, 2) || '') : ''),
        level3CategoryId: article?.level3CategoryId ? String(article.level3CategoryId) : 
                        (selectedCategory?.level === 3 ? String(selectedCategory.id) : ''),
        targetState: article?.targetState || '',
        targetCity: article?.targetCity || '',
        metaDescription: article?.metaDescription || '',
        metaKeywords: article?.metaKeywords || '',
        status: (article?.status as 'draft' | 'published' | 'archived') || 'draft',
        publishedAt: article?.publishedAt ? article.publishedAt.toISOString() : null,
      });
    }
  }, [open, article, selectedCategory, categories, form]);

  useEffect(() => {
    if (selectedCategory) {
      if (selectedCategory.level === 1) {
        const childCategories = categories.filter(c => 
          c.level === 2 && c.parentId === selectedCategory.id
        );
        setLevel2Categories(childCategories);
      }
      else if (selectedCategory.level === 2 && selectedCategory.parentId) {
        const parentCategory = categories.find(c => c.id === selectedCategory.parentId);
        if (parentCategory) {
          form.setValue('level1CategoryId', String(parentCategory.id));
        }
        
        const childCategories = categories.filter(c => 
          c.level === 3 && c.parentId === selectedCategory.id
        );
        setLevel3Categories(childCategories);
      }
      else if (selectedCategory.level === 3 && selectedCategory.parentId) {
        const parentCategory = categories.find(c => c.id === selectedCategory.parentId);
        if (parentCategory && parentCategory.parentId) {
          const grandParentCategory = categories.find(c => c.id === parentCategory.parentId);
          if (grandParentCategory) {
            form.setValue('level1CategoryId', String(grandParentCategory.id));
            
            const siblings = categories.filter(c => 
              c.level === 2 && c.parentId === grandParentCategory.id
            );
            setLevel2Categories(siblings);
            form.setValue('level2CategoryId', String(parentCategory.id));
          }
        }
      }
    }
  }, [selectedCategory, categories, form]);

  useEffect(() => {
    if (level1Id && !isCategorySelectionDisabled) {
      const parentId = parseInt(level1Id || '0', 10);
      const childCategories = categories.filter(c => 
        c.level === 2 && c.parentId === parentId
      );
      setLevel2Categories(childCategories);
      
      const currentLevel2Id = form.getValues('level2CategoryId');
      if (currentLevel2Id && !childCategories.some(c => String(c.id) === currentLevel2Id)) {
        form.setValue('level2CategoryId', '');
        form.setValue('level3CategoryId', '');
      }
      
      generateSlug();
    } else if (!isCategorySelectionDisabled) {
      setLevel2Categories([]);
      form.setValue('level2CategoryId', '');
      form.setValue('level3CategoryId', '');
      
      generateSlug();
    }
  }, [level1Id, categories, form, isCategorySelectionDisabled, generateSlug]);

  useEffect(() => {
    if (level2Id && !isCategorySelectionDisabled) {
      const parentId = parseInt(level2Id || '0', 10);
      const childCategories = categories.filter(c => 
        c.level === 3 && c.parentId === parentId
      );
      setLevel3Categories(childCategories);
      
      const currentLevel3Id = form.getValues('level3CategoryId');
      if (currentLevel3Id && !childCategories.some(c => String(c.id) === currentLevel3Id)) {
        form.setValue('level3CategoryId', '');
      }
      
      generateSlug();
    } else if (!isCategorySelectionDisabled) {
      setLevel3Categories([]);
      form.setValue('level3CategoryId', '');
      
      generateSlug();
    }
  }, [level2Id, categories, form, isCategorySelectionDisabled, generateSlug]);

  useEffect(() => {
    generateSlug();
  }, [level1Id, level2Id, level3Id, generateSlug]);

  useEffect(() => {
    if (title && !slug) {
      generateSlug();
    }
  }, [title, slug, generateSlug]);

  const handleSubmit = (data: ArticleFormData) => {
    const formData = new FormData();
    
    if (article?.id) {
      formData.append('id', article.id.toString());
    }
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    onSubmit(formData);
  };

  const getCategoryName = (level: number, id: string) => {
    if (!id) return '';
    const categoryId = parseInt(id, 10);
    const category = categories.find(c => c.id === categoryId && c.level === level);
    return category?.name || '';
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        form.reset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={(e) => {
                        field.onChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control as any}
                name="level1CategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cấp 1</FormLabel>
                    {isCategorySelectionDisabled ? (
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                        {selectedCategory?.level === 1 
                          ? selectedCategory.name 
                          : getCategoryName(1, field.value)}
                      </div>
                    ) : (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {level1Categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="level2CategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cấp 2</FormLabel>
                    {isCategorySelectionDisabled ? (
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                        {selectedCategory?.level === 2 
                          ? selectedCategory.name 
                          : field.value 
                            ? getCategoryName(2, field.value) 
                            : 'Không có'}
                      </div>
                    ) : (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        disabled={!level1Id || level2Categories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {level2Categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="level3CategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cấp 3</FormLabel>
                    {isCategorySelectionDisabled ? (
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                        {selectedCategory?.level === 3 
                          ? selectedCategory.name 
                          : field.value 
                            ? getCategoryName(3, field.value) 
                            : 'Không có'}
                      </div>
                    ) : (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        disabled={!level2Id || level3Categories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {level3Categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="targetState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/thành (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="targetCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/huyện (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Xuất bản</SelectItem>
                      <SelectItem value="archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <TiptapEditor 
                      content={field.value} 
                      onChange={field.onChange}
                      minHeight="400px"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <FormField
                control={form.control as any}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả (Meta Description)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="metaKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Từ khóa (Meta Keywords)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Từ khóa cách nhau bởi dấu phẩy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang xử lý...' : (article ? 'Cập nhật' : 'Tạo mới')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 