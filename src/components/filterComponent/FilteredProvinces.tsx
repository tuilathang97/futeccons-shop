"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { Province } from 'types'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormControl, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from 'lucide-react' 

const formSchema = z.object({
    thanhPho: z.string().optional(),
    quan: z.string().optional(),
    phuong: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

function FilteredProvinces({ provinces }: { provinces: Province[] }) {
    const path = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
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

    const districts = provinces.find(province => province.codename === thanhPho?.replace(/-/g, '_'))?.districts || []

    const wards = districts.find(
        district => district.codename === quan?.replace(/-/g, '_')
    )?.wards || []

    useEffect(() => {
        const thanhPhoParam = searchParams.get('thanhPho')
        const quanParam = searchParams.get('quan')
        const phuongParam = searchParams.get('phuong')
        
        if (thanhPhoParam) {
            // Tìm province tương ứng
            const province = provinces.find(p => p.codename === thanhPhoParam)
            if (province) {
                form.setValue("thanhPho", province.codename)
                setDisplayText(province.name)
                
                // Nếu có quận trong URL
                if (quanParam) {
                    const districts = province.districts || []
                    const district = districts.find(d => d.codename === quanParam)
                    if (district) {
                        form.setValue("quan", district.codename)
                        setDisplayText(district.name)
                        
                        // Nếu có phường trong URL
                        if (phuongParam) {
                            const wards = district.wards || []
                            const ward = wards.find(w => w.codename === phuongParam)
                            if (ward) {
                                form.setValue("phuong", ward.codename)
                                setDisplayText(ward.name)
                            }
                        }
                    }
                }
            }
        }
    }, [searchParams, provinces, form])

    const handleProvinceSelect = (value: string) => {
        const province = provinces.find(p => p.codename === value)
        if (province) {
            form.setValue("thanhPho", province.codename)
            form.setValue("quan", "")
            form.setValue("phuong", "")
            setDisplayText(province.name)
            updateQueryParams(province.codename, "", "") 
        }
    }

    const handleDistrictSelect = (value: string) => {
        const district = districts.find(d => d.codename === value)
        const province = provinces.find(p => p.codename === thanhPho?.replace(/-/g, '_'))
        if (district && province) {
            form.setValue("quan", district.codename)
            form.setValue("phuong", "")
            setDisplayText(district.name)
            if (thanhPho)
                updateQueryParams(thanhPho, district.codename, "")
        }
    }

    const handleWardSelect = (value: string) => {
        const ward = wards.find(w => w.codename === value)
        const province = provinces.find(p => p.codename === thanhPho?.replace(/-/g, '_'))
        const district = districts.find(d => d.codename === quan?.replace(/-/g, '_'))
        if (ward && province && district) {
            form.setValue("phuong", ward.codename)
            setDisplayText(ward.name)
            if (thanhPho && quan)
                updateQueryParams(thanhPho, quan, ward.codename)
        }
    }

    const handleReset = () => {
        form.reset()
        setDisplayText("Khu vực")
        router.push(path)
    }

    const updateQueryParams = (thanhPho: string, quan: string, phuong: string) => {
        const params = new URLSearchParams()
        if (thanhPho) {
            params.append('thanhPho', thanhPho)
        }
        if (quan) {
            params.append('quan', quan)
        }
        if (phuong) {
            params.append('phuong', phuong)
        }
        router.push(`${path}?${params.toString()}`)
    }

    return (
        <Form {...form}>
            <form className="flex min-w-full">
                <Dialog>
                    <DialogTrigger asChild className={`${displayText !== "Khu vực" ? "border border-red-500 text-red-500 hover:text-red-600 " : "khu vực"} min-w-full md:w-[200px] justify-between`}>
                        <Button variant="outline">
                            {displayText} <ChevronDown />
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
                                                        value={province.codename}
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
                                                        value={district.codename}
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
                                                        value={ward.codename}
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
    )
}

export default FilteredProvinces
