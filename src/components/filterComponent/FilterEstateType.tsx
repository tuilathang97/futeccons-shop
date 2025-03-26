"use client"
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Category } from '@/db/schema'
import { getCategoryById } from '@/lib/queries/categoryQueries'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

function FilterEstateType({ childCategories, currentChildCategory }: { childCategories: Category[], currentChildCategory?: Category }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleValueChange(id: string) {
    const value = await getCategoryById(Number(id))

    if (value && value.slug) {
      // Tạo đối tượng URLSearchParams từ chuỗi search params hiện tại
      const currentParams = new URLSearchParams(searchParams.toString())

      // Tạo URL mới kết hợp slug với search params hiện tại
      const newUrl = currentParams.toString()
        ? `${value.slug}?${currentParams.toString()}`
        : value.slug

      // Điều hướng đến URL mới
      router.push(newUrl)

      // Tối ưu hiệu suất bằng cách prefetch
      router.prefetch(newUrl)
    }
  }

  return (
    <div>
      <Select
        onValueChange={(id) => { handleValueChange(id) }}
        defaultValue={currentChildCategory?.id.toString()}
      >
        <SelectTrigger className={cn(
          "w-full sm:w-[200px]",
          (currentChildCategory ? "border-red-500 text-red-500 hover:text-red-600 target:border-red-600" : "")
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
