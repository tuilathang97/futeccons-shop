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
export interface optionI {
    label: string
    slug: string
}
export interface SubOptionI {
    label: string;
    slug: string;
    options: Array<optionI>;
}

export interface OptionsI {
    categories: SubOptionI[];
}

export const OPTIONS: OptionsI = {
    categories: [
        {
            label: "Bán nhà đất",
            slug: "/ban-nha-dat",
            options: [
                { label: "Bán nhà", slug: "/ban-nha" },
                { label: "Bán căn hộ", slug: "/ban-can-ho" },
                { label: "Bán đất", slug: "/ban-dat" }
            ]
        },
        {
            label: "Cho Thuê",
            slug: "/cho-thue",
            options: [
                { label: "Căn hộ, chung cư, ks", slug: "/can-ho-chung-cu-khach-san" },
                { label: "Nhà trọ, phòng trọ", slug: "/can-ho-chung-cu-khach-san" },
                { label: "Văn phòng, mặt bằng", slug: "/van-phong-mat-bang" },
                { label: "Nhà xưởng, kho đất", slug: "/nha-xuong-kho-dat" }
            ]
        },
        {
            label: "Sang Nhượng",
            slug: "/sang-nhuong",
            options: [
                { label: "Kiốt, Sạp chợ", slug: "/kiot-sap-cho" },
                { label: "Quán ăn, Nhà hàng, Khách sạn", slug: "/quan-an-nha-hang-khach-san" },
                { label: "Quán cà phê, Đồ uống", slug: "/quan-ca-phe" },
                { label: "Shop thời trang, Tiệm tóc, Spa", slug: "/shop-thoi-trang-tiem-toc" },
                { label: "Shophouse", slug: "/shophouse" }
            ]
        },
        {
            label: "Dịch vụ",
            slug: "/dich-vu",
            options: [] // Giữ nguyên array rỗng
        }
    ]
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
    const { setError, watch, resetField } = form
    const parent = watch("danhMuc")
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
                                                {OPTIONS.categories.map((op: SubOptionI, key: number) => (
                                                    <SelectItem key={key} value={op.label}>
                                                        {op.label}
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
                                                        {OPTIONS.categories
                                                            .find(category => category.label === parent)
                                                            ?.options.map((option, index: number) => (
                                                                <SelectItem key={index} value={option.slug}>
                                                                    {option.label}
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