"use client"
import { Category } from '@/db/schema'
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCategoryById } from '@/lib/queries/categoryQueries'

function FilterEstateKind({
    currentCategory,
    categories
}: {
    currentCategory: Category | null,
    categories: Category[]
}) {
    const router = useRouter()
    
    const searchParams = useSearchParams();
    const [selectedValue, setSelectedValue] = useState<string>('')
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        if (currentCategory) {
            setSelectedValue(currentCategory.id.toString())
        }
    }, [currentCategory])

    async function getCategoryBySelectedId(value: string) {
        const afterChangeSelected = await getCategoryById(Number(value))

        if (afterChangeSelected?.slug) {
            const currentParams = new URLSearchParams(searchParams.toString());

            const newUrl = currentParams.toString()
                ? `${afterChangeSelected.slug}?${currentParams.toString()}`
                : afterChangeSelected.slug;

            router.prefetch(newUrl);
            router.push(newUrl);
        }
    }

    const handleValueChange = (value: string) => {
        setSelectedValue(value)
        setIsChanged(true)
        getCategoryBySelectedId(value)
        return
    }

    return (
        <div>
            <Select
                value={selectedValue}
                onValueChange={handleValueChange}
            >
                <SelectTrigger
                    className={cn(
                        "w-full sm:w-[200px]",
                        (isChanged || selectedValue) && "border-red-500 text-red-500 hover:text-red-600 target:border-red-600"
                    )}
                >
                    <SelectValue placeholder="chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Chọn loại giao dịch</SelectLabel>
                        {categories.map((cate: Category) => (
                            <SelectItem
                                key={cate.id}
                                value={cate.id.toString()}
                            >
                                {cate.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FilterEstateKind
