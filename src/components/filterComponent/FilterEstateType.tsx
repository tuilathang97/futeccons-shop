"use client"
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Category } from '@/db/schema'
import { getCategoryById } from '@/lib/queries/categoryQueries'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

function FilterEstateType({childCategories,currentChildCategory}:{childCategories:Category[],currentChildCategory?:Category}) {
  const route = useRouter()
  async function handleValueChange(id:string){
    const value = await getCategoryById(Number(id))
    if(value && value.slug){
      route.push(value.slug)
    }
  }
  return (
    <div>
      <Select onValueChange={(id) => {handleValueChange(id)}}>
        <SelectTrigger  className={cn("w-full sm:w-[200px]",(currentChildCategory ? "border-red-500 text-red-500 hover:text-red-600 target:border-red-600" : ""))}>
          <SelectValue placeholder={currentChildCategory ? currentChildCategory.name : "Chọn loại bất động sản"}  />
        </SelectTrigger>
        <SelectContent >
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