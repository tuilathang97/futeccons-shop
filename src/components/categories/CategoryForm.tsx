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
import { Category, CategorySchema } from '@/components/categories/categorySchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CategoryForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createCategoryAction, {message: ""});
  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      parent_id: undefined,
      level: 1,
      note: ""
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  const parentId = form.watch("parent_id");
  console.log({parentId})
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
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <Select disabled={Array.isArray(categories) && categories.length === 0} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger >
                    <SelectValue placeholder="Tên danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    categories.map(category => {
                      console.log({category})
                      return(
                        <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                      )
                    })
                  }
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/* workaorund as dropdown does not attach data to FormData when submit */}
        <input type="hidden" name="parent_id" id="parent_id" />
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
        <Button type="submit">Lưu</Button>
        <FormMessage>{state?.message}</FormMessage>
      </form>
    </Form>
  )
}



