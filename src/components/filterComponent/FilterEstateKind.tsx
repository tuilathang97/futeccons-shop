"use client"
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Category } from '@/db/schema'
import { getCategoryById } from '@/lib/queries/categoryQueries'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

function FilterEstateKind({ childSubCategories, CurrentSubCategory }: { childSubCategories?: Category[], CurrentSubCategory?: Category }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    async function handleSubChildCatChange(id: string) {
        const currentSubChildCat = await getCategoryById(Number(id))

        if (currentSubChildCat && currentSubChildCat.slug) {
            const currentParams = new URLSearchParams(searchParams.toString())
            const newUrl = currentParams.toString()
                ? `${currentSubChildCat.slug}?${currentParams.toString()}`
                : currentSubChildCat.slug

            router.push(newUrl)
            router.prefetch(newUrl)
        }
    }

    return (
        <div>
            <Select
                onValueChange={(id) => handleSubChildCatChange(id)}
                disabled={childSubCategories?.length === 0 || !childSubCategories ? true : false}
                defaultValue={CurrentSubCategory?.id.toString()}
            >
                <SelectTrigger className={cn(
                    "w-full sm:w-[200px]",
                    (CurrentSubCategory ? "border-red-500 text-red-500 hover:text-red-600 target:border-red-600" : "")
                )}>
                    <SelectValue placeholder={CurrentSubCategory ? CurrentSubCategory.name : "Chọn kiểu bất động sản"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Chọn kiểu bất động sản</SelectLabel>
                        {childSubCategories?.map((cate) => {
                            return (
                                <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FilterEstateKind
