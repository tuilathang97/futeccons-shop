"use client"
import React from 'react'
import { FaqItem } from '../blocks/faq'
import { useFormContext } from "react-hook-form";
import { Post } from './postSchema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

function PostInfo() {
    const form = useFormContext<Post>();
    
    // Watch field values in real-time to update validation status
    const tieuDeBaiViet = form.watch("tieuDeBaiViet");
    const noiDung = form.watch("noiDung");
    
    // Check if fields meet the Zod schema validation requirements
    const isTitleValid = Boolean(tieuDeBaiViet) && tieuDeBaiViet.length >= 1;
    const isContentValid = Boolean(noiDung) && noiDung.length >= 30;
    
    // Section is complete when both fields pass validation
    const isSectionComplete = isTitleValid && isContentValid;
    
    return (
        <div>
            <FaqItem
                question="Thông tin Bài viết"
                index={0}
                isFinish={isSectionComplete}
            >
                <div className="">
                    <FormField
                        control={form.control}
                        name="tieuDeBaiViet"
                        render={({ field }) => (
                            <FormItem className="md:col-span-3 mt-4 w-full">
                                <FormLabel>Tiêu đề bài viết <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tiêu đề bài viết..."
                                        className="w-full h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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

export default PostInfo;