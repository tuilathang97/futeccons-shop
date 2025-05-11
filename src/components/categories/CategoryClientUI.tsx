'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { type Category } from '@/db/schema';
import { Pencil, Trash2, PlusCircle, ExternalLink } from 'lucide-react';
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/actions/categoryActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema } from './categorySchema';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

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

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      parentId: undefined,
      level: 1,
      note: "",
      slug: "",
      path: ""
    },
  });

  const handleOpenCreateModal = () => {
    form.reset(); // Reset form when opening create modal
    setSelectedCategory(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    form.reset({
      name: category.name,
      parentId: category.parentId?.toString(),
      note: category.note || "",
      slug: category.slug || "",
      path: category.path || "",
      level: category.level
    });
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  const onSubmit = async (data: CategoryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        let result;
        if (selectedCategory && selectedCategory.id) {
          formData.append('id', String(selectedCategory.id));
          result = await updateCategoryAction(formData);
        } else {
          result = await createCategoryAction(formData);
        }
        
        if (result.success) {
          setCategories(result.data || []);
          toast({
            title: "Thành công",
            description: result.message,
          });
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.message,
          });
        }
        
        router.refresh();
      } catch (error) {
        console.error('Error saving category:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi lưu danh mục",
        });
      }
    });
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    startTransition(async () => {
      try {
        const result = await deleteCategoryAction(selectedCategory.id);
        
        if (result.success) {
          setCategories(result.data || []);
          toast({
            variant: "success",
            title: "Thành công",
            description: result.message,
          });
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.message,
          });
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

  const parentCategories = categories.filter(c => c.level === 1 || c.level === 2);

  const formatPath = (path: string | null) => {
    if (!path) return null;
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateModal}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tạo danh mục mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Tạo danh mục mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết cho danh mục mới. Nhấn &apos;Lưu&apos; để hoàn tất.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha</FormLabel>
                      <Select 
                        disabled={parentCategories.length === 0} 
                        onValueChange={field.onChange} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name} {category.path && `(${category.path})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Input placeholder="Ghi chú" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Tự động tạo từ tên nếu để trống" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isPending}>Hủy</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
                    <Dialog open={isEditModalOpen && selectedCategory?.id === category.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedCategory(null); setIsEditModalOpen(isOpen);}}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(category)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Sửa</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                          <DialogDescription>
                            Cập nhật thông tin danh mục. Nhấn &apos;Lưu&apos; để hoàn tất.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedCategory && (
                          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                            <input type="hidden" name="id" value={selectedCategory.id} />
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tên</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tên" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="parentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Danh mục cha</FormLabel>
                                  <Select 
                                    disabled={parentCategories.length === 0} 
                                    onValueChange={field.onChange} 
                                    value={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {parentCategories
                                        .filter(c => c.id !== selectedCategory.id) // Prevent selecting self as parent
                                        .map((category) => (
                                          <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name} {category.path && `(${category.path})`}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="note"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ghi chú</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ghi chú" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Slug</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tự động tạo từ tên nếu để trống" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isPending}>Hủy</Button>
                              </DialogClose>
                              <Button type="submit" disabled={isPending}>
                                {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                              </Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isDeleteModalOpen && selectedCategory?.id === category.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedCategory(null); setIsDeleteModalOpen(isOpen);}}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(category)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Xác nhận xóa</DialogTitle>
                          <DialogDescription>
                            Bạn có chắc chắn muốn xóa danh mục &quot;{selectedCategory?.name}&quot;? Hành động này không thể hoàn tác.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>Hủy</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={handleDeleteCategory} disabled={isPending}>
                            {isPending ? 'Đang xóa...' : 'Xóa'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 