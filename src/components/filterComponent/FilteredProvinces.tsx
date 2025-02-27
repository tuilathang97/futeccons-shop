"use client"
import React, { useState } from 'react'
// import { usePathname } from "next/navigation"
import {  useRouter } from "next/navigation"
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
    // const path = usePathname()
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
        province => province.name === thanhPho
    )?.districts || []

    const wards = districts.find(
        district => district.name === quan
    )?.wards || []

    const handleProvinceSelect = (value: string) => {
        const province = provinces.find(p => p.name === value)
        if (province) {
            form.setValue("thanhPho", value)
            form.setValue("quan", "")
            form.setValue("phuong", "")
            setDisplayText(value)
            console.log("Selected province:", {
                name: value,
                codename: province.codename
            })
            // router.push(`${path}/${province.codename}`)
        }
    }

    const handleDistrictSelect = (value: string) => {
        const district = districts.find(d => d.name === value)
        const province = provinces.find(p => p.name === thanhPho)
        if (district && province) {
            form.setValue("quan", value)
            form.setValue("phuong", "")
            setDisplayText(value)
            console.log("Selected district:", {
                name: value,
                codename: district.codename
            })
        }
    }

    const handleWardSelect = (value: string) => {
        const ward = wards.find(w => w.name === value)
        const province = provinces.find(p => p.name === thanhPho)
        const district = districts.find(d => d.name === quan)
        if (ward && province && district) {
            form.setValue("phuong", value)
            setDisplayText(value)
            console.log("Selected ward:", {
                name: value,
                codename: ward.codename
            })
        }
    }

    const handleReset = () => {
        form.reset()
        setDisplayText("Khu vực")
        router.push("/")
    }

    return (
        <div>
            <Form {...form}>
                <form className="w-full flex">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full md:w-[200px] justify-between">
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
                                                            value={province.name}
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
                                                            value={district.name}
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
                                                            value={ward.name}
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
