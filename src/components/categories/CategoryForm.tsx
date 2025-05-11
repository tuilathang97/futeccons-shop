'use client'

import { type Category } from '@/db/schema';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema } from './categorySchema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getParentCategories } from '@/lib/utils';

type CategoryFormData = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
  categories: Category[];
  selectedId?: number;
  isPending?: boolean;
  submitLabel?: string;
}

export default function CategoryForm({ 
  defaultValues,
  onSubmit,
  categories,
  selectedId,
  isPending,
  submitLabel = 'Lưu'
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      parentId: undefined,
      level: 1,
      note: "",
      slug: "",
      path: "",
      ...defaultValues
    },
  });

  const parentCategories = getParentCategories(categories)
    .filter(c => c.id !== selectedId); // Prevent selecting self as parent

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input required placeholder="Tên" {...field} value={field.value || ''} />
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
                <Input required placeholder="Nhập lại tên danh mục không dấu (ví dụ: 'tieu-de-bai-viet')" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang lưu...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}



