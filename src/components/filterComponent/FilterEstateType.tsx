"use client"
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Category } from '@/db/schema'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCategories } from '@/contexts/CategoriesContext'
function FilterEstateType({ childCategories, currentChildCategory }: { childCategories: Category[], currentChildCategory?: Category }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {categories} = useCategories()
  function handleValueChange(id: string) {
    const value = categories.find(category => category.id === Number(id))
    const currentParams = new URLSearchParams(searchParams.toString()).toString()
    const newUrl = currentParams.length > 0 ? `${value?.path}?${currentParams.toString()}` : value?.path
    if(newUrl){
      router.push(newUrl)
      router.prefetch(newUrl)
    }
  }

  return (
    <div>
      <Select
        onValueChange={(id) => { handleValueChange(id) }}
      >
        <SelectTrigger className={cn(
          "w-full sm:w-[200px]",
          (currentChildCategory ? "border-red-500 !text-red-500 hover:text-blue-600 target:border-red-600" : "")
        )}>
          <SelectValue placeholder={currentChildCategory ? currentChildCategory.name : "Chọn loại bất động sản"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Chọn loại bất động sản</SelectLabel>
            {childCategories.map((cate) => {
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

export default FilterEstateType
