"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OPTIONS = {
    "Bán nhà đất": ["Bán nhà", "Bán căn hộ", "Bán đất"],
    "Cho Thuê": [
        "Căn hộ, chung cư, ks",
        "Nhà trọ, phòng trọ",
        "Văn phòng, mặt bằng",
        "Nhà xưởng, kho đất",
    ],
    "Sang Nhượng": [
        "Kiốt, Sạp chợ",
        "Quán ăn, Nhà hàng, Khách sạn",
        "Quán cà phê, Đồ uống",
        "Shop thời trang, Tiệm tóc, Spa",
        "Shophouse",
        "Sang nhượng khác",
    ],
    "Dịch vụ": [],
};

const formSchema = z.object({
    danhMuc: z.string().min(2, { message: "Danh mục là bắt buộc" }),
    danhMucPhu: z.string().optional()
})

function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            danhMuc: "",
            danhMucPhu: "",
        },
    })
    const { setError, watch,resetField } = form
    const parent = watch("danhMuc")
    console.log(parent)
    function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.danhMuc !== "Dịch vụ" && !values.danhMucPhu) {
            setError("danhMucPhu", { message: "Danh mục phụ là bắt buộc" })
            return
        }
        console.log(values)
    }
    return (
        <div className='container pt-4'>
            <div className='flex flex-col items-center justify-center'>
                <h1>Đăng tin</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[20rem] p-4 pt-8">
                        <FormField
                            control={form.control}
                            name="danhMuc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục chính</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                resetField("danhMucPhu")
                                            }}
                                        >
                                            <SelectTrigger className="w-[300px]">
                                                <SelectValue placeholder="Chọn danh mục chính" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(OPTIONS).map((key) => (
                                                    <SelectItem key={key} value={key}>
                                                        {key}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="danhMucPhu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {parent && parent !== "Dịch vụ" && (
                                            <div>
                                                <FormLabel>Danh mục phụ</FormLabel>
                                                <Select {...field} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-[300px]">
                                                        <SelectValue placeholder="Chọn danh mục phụ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {OPTIONS[parent as keyof typeof OPTIONS].map((option) => (
                                                            <SelectItem key={option} value={option}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='min-w-full' type="submit">Submit</Button>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default Page