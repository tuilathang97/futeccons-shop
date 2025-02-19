'use client'

import { useActionState, useRef } from 'react';
import { createCategoryAction } from '@/actions/categoriesActions';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySchema } from './categorySchema';
import { Category } from '@/db/schema';

export default function CategoryForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createCategoryAction,{ message: "" });
  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      parentId: undefined,
      level: 1,
      note: "",
      slug: ""
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => formRef?.current?.submit())} className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
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
              <FormLabel>Tên danh mục</FormLabel>
              <Select disabled={Array.isArray(categories) && categories.length === 0} onValueChange={field.onChange} defaultValue={field.value} {...field}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tên danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    categories?.filter(category => category.level && category.level < 3)
                      .map(category => {
                        return(
                          <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                        )
                      })
                  }
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
                <Input required placeholder="slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full'>Lưu</Button>
        <FormMessage>{state?.message}</FormMessage>
      </form>
    </Form>
  )
}



