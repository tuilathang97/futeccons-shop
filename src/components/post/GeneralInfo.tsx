'use client'

import { useFormContext } from "react-hook-form"
import { FaqItem } from "../blocks/faq"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Category } from "@/db/schema";
import { hasValue } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Post } from "./postSchema";
import { ArrowRightIcon } from "lucide-react";

type FormStateType = {
  level1Categories: Category[],
  level2Categories: Category[],
  level3Categories: Category[],
}


const GeneralInfoClient = ({ categories }: { categories: Category[] }) => {
  const [formState, setFormState] = useState<FormStateType>({
    level1Categories: [],
    level2Categories: [],
    level3Categories: [],
  })
  const form = useFormContext<Post>();
  const [
    level1Category,
    level2Category,
    level3Category
  ] = form.watch(["level1Category", "level2Category", "level3Category"]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        switch (name) {
          case 'level1Category':
            form.setValue("level2Category", "");
            form.setValue("level3Category", "");
            setFormState(prevState => ({
              ...prevState,
              level2Categories: categories.filter(cate => cate.parentId?.toString() === value.level1Category),
              level3Categories: [],
            }));
            break;
          case 'level2Category':
            form.setValue("level3Category", "");
            setFormState(prevState => ({
              ...prevState,
              level3Categories: categories.filter(cate => cate.parentId?.toString() === value.level2Category),
            }));
            break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, categories]);

  return (
    <FaqItem
      question="Thông tin chung"
      index={0}
      isFinish={Boolean(level1Category) && Boolean(level2Category) && Boolean(level3Category)}
    >
      <div className="flex flex-col justify-between gap-2 md:flex-nowrap md:flex-row md:items-center">
        <FormField
          control={form.control}
          name="level1Category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Select disabled={Array.isArray(categories) && categories.length === 0} onValueChange={field.onChange} defaultValue={field.value} {...field}>
                <FormControl>
                  <SelectTrigger className="flex-1 basis-full md:w-[180px]">
                    <div>
                      <SelectValue placeholder="Loại giao dịch" />
                      <span className="text-red-500">*</span>
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    categories?.filter(category => category.level && category.level === 1 && category.name !== "Tất cả bài viết")
                      .map(category => {
                        return (
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
        <div className="flex-col items-center justify-center hidden md:flex">
          <ArrowRightIcon />
        </div>
        <FormField
          control={form.control}
          name="level2Category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Select
                disabled={!hasValue(form.getValues("level1Category"))}
                onValueChange={field.onChange}
                {...field}>
                <FormControl>
                  <SelectTrigger className="flex-1 basis-full md:w-[180px]">
                    <div>
                      <SelectValue placeholder="Loại bất động sản" />
                      <span className="text-red-500">*</span>
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    formState.level2Categories.map(category => {
                      return (
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
        <div className="flex-col items-center justify-center hidden md:flex">
          <ArrowRightIcon />
        </div>
        <FormField
          control={form.control}
          name="level3Category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Select
                disabled={!hasValue(form.getValues("level2Category"))}
                onValueChange={field.onChange} {...field}>
                <FormControl>
                  <SelectTrigger className="flex-1 basis-full md:w-[180px]">
                    <div>
                      <SelectValue placeholder="Kiểu bất động sản" />
                      <span className="text-red-500">*</span>
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    formState.level3Categories.map(category => {
                      return (
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
      </div>
    </FaqItem>
  )
}

export default GeneralInfoClient;