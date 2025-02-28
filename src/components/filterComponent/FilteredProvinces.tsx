"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Province } from 'types'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormControl, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownIcon } from 'lucide-react'

const formSchema = z.object({
    thanhPho: z.string().optional(),
    quan: z.string().optional(),
    phuong: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

function FilteredProvinces({ provinces }: { provinces: Province[] }) {
    const router = useRouter()
    const [displayText, setDisplayText] = useState("Khu vực")
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            thanhPho: "",
            quan: "",
            phuong: ""
        },
    })

    const { thanhPho, quan, phuong } = form.watch()

    const districts = provinces.find(
        province => province.codename === thanhPho.replace(/-/g, '_') // Sử dụng codename đã được định dạng cho thành phố
    )?.districts || []

    const wards = districts.find(
        district => district.codename === quan.replace(/-/g, '_') // Sử dụng codename đã được định dạng cho quận
    )?.wards || []

    const handleProvinceSelect = (value: string) => {
        const province = provinces.find(p => p.codename === value)
        if (province) {
            form.setValue("thanhPho", province.codename) // Lưu codename cho thành phố
            form.setValue("quan", "")
            form.setValue("phuong", "")
            setDisplayText(province.name) // Hiển thị tên thành phố
            updateQueryParams(province.codename, "", "") // Cập nhật query params với codename
            console.log("Selected province:", {
                name: province.name,
                codename: province.codename
            })
        }
    }

    const handleDistrictSelect = (value: string) => {
        const district = districts.find(d => d.codename === value)
        const province = provinces.find(p => p.codename === thanhPho.replace(/-/g, '_'))
        if (district && province) {
            form.setValue("quan", district.codename) // Lưu codename cho quận
            form.setValue("phuong", "")
            setDisplayText(district.name) // Hiển thị tên quận
            updateQueryParams(thanhPho, district.codename, "") // Cập nhật query params với codename
            console.log("Selected district:", {
                name: district.name,
                codename: district.codename
            })
        }
    }

    const handleWardSelect = (value: string) => {
        const ward = wards.find(w => w.codename === value)
        const province = provinces.find(p => p.codename === thanhPho.replace(/-/g, '_'))
        const district = districts.find(d => d.codename === quan.replace(/-/g, '_'))
        if (ward && province && district) {
            form.setValue("phuong", ward.codename) // Lưu codename cho phường
            setDisplayText(ward.name) // Hiển thị tên phường
            updateQueryParams(thanhPho, quan, ward.codename) // Cập nhật query params với codename
            console.log("Selected ward:", {
                name: ward.name,
                codename: ward.codename
            })
        }
    }

    const handleReset = () => {
        form.reset()
        setDisplayText("Khu vực")
        router.push('/') // Đưa về trang chủ hoặc một trang mặc định nào đó
    }

    const updateQueryParams = (thanhPho: string, quan: string, phuong: string) => {
        const params = new URLSearchParams()
        if (thanhPho) {
            params.append('thanhPho', thanhPho) // Sử dụng codename cho thành phố
        }
        if (quan) {
            params.append('quan', quan) // Sử dụng codename cho quận
        }
        if (phuong) {
            params.append('phuong', phuong) // Sử dụng codename cho phường
        }
        router.push(`?${params.toString()}`) // Cập nhật URL với các query params mới
    }

    return (
        <div>
            <Form {...form}>
                <form className="w-full flex">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className={`${displayText ? "border border-red-500 text-red-500 hover:text-red-600 " : ""} w-full md:w-[200px] justify-between`}>
                                {displayText} <ArrowDownIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Lọc theo khu vực</DialogTitle>
                                <DialogDescription>
                                    Chọn khu vực bạn muốn tìm kiếm
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="thanhPho"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thành phố</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleProvinceSelect(value)
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn thành phố" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {provinces.map((province) => (
                                                        <SelectItem
                                                            key={province.code}
                                                            value={province.codename} // Sử dụng codename trong SelectItem
                                                        >
                                                            {province.name}
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
                                    name="quan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quận</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleDistrictSelect(value)
                                                }}
                                                value={field.value}
                                                disabled={!thanhPho}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn quận" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {districts.map((district) => (
                                                        <SelectItem
                                                            key={district.code}
                                                            value={district.codename} // Sử dụng codename trong SelectItem
                                                        >
                                                            {district.name}
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
                                    name="phuong"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phường</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleWardSelect(value)
                                                }}
                                                value={field.value}
                                                disabled={!quan}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn phường" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {wards.map((ward) => (
                                                        <SelectItem
                                                            key={ward.code}
                                                            value={ward.codename} // Sử dụng codename trong SelectItem
                                                        >
                                                            {ward.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={!thanhPho && !quan && !phuong}
                                >
                                    Đặt lại
                                </Button>
                                <DialogClose asChild>
                                    <Button type="button">
                                        Áp dụng
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    )
}

export default FilteredProvinces
