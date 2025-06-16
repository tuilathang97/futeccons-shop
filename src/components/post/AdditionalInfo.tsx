"use client"

import { Post } from "./postSchema"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useFormContext } from "react-hook-form";
import { FaqItem } from "../blocks/faq";

const AdditionalInfo = () => {
  const form = useFormContext<Post>();
  const [chieuNgang, chieuDai] = form.watch(["chieuDai", "chieuNgang"]);
  return (
    <FaqItem
      question="Thông tin bổ sung"
      index={1}
      isFinish={Boolean(chieuNgang) && Boolean(chieuDai)}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="chieuNgang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chiều ngang</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập chiều ngang"
                  type="number"
                  onChange={(e) => {
                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chieuDai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chiều dài (m2)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập chiều dài"
                  type="number"
                  onChange={(e) => {
                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FaqItem>
  )
}

export default AdditionalInfo
