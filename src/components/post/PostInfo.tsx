"use client"
import React from 'react'
import { FaqItem } from '../blocks/faq'
import { useFormContext } from "react-hook-form";
import { Post } from './postSchema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

function PostInfo() {
    const form = useFormContext<Post>();
    return (
        <div>
            <FaqItem
                question="Thông tin Bài viết"
                index={0}
                isFinish={false}
            >
                <div className="">
                    <FormField
                        control={form.control}
                        name="noiDung"
                        render={({ field }) => (
                            <FormItem className="md:col-span-3 mt-4 w-full">
                                <FormLabel>Nội dung bài viết <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Mô tả chi tiết về bất động sản của bạn..."
                                        className="resize-none min-h-[150px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </FaqItem>
        </div>
    )
}

export default PostInfo