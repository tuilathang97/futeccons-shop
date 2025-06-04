"use client"
import { useCategories } from '@/contexts/CategoriesContext'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Category } from '@/db/schema'
import Image from 'next/image'
import PageWrapper from '../PageWrapper'
import { useRouter } from 'next/navigation'
interface CategoryPickerProps {
    filterCategories?: Category[]
    className?: string
}


function CategoriesRender(categories: Category[],imagesUrl:string[]) {
    const router = useRouter()

    const renderCategories = categories.map((category, index) => {
        return (
            <button
                onClick={() => router.push(category.path || "/")}
                key={category.id || index}
                className="group min-w-full min-h-full flex flex-col items-center gap-2 rounded-md transition-colors hover:bg-slate-50"
            >
                <div className='relative min-w-full hover:shadow-md transition-shadow duration-300'>
                    <div className="flex flex-col-reverse items-center gap-2">
                        <Image className='z-10 object-cover brightness-50 min-w-full min-h-full w-[10rem] h-[10rem] rounded-md' src={imagesUrl[index]} alt={category.name || ""} width={200} height={200} />
                    </div>
                    <p className="text-2xl flex justify-center w-full text-center flex text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 font-bold">{category.name}</p>
                </div>
            </button>
        )
    })
    return renderCategories
}

function CategoryPicker({ filterCategories, className }: CategoryPickerProps) {
    const { categories } = useCategories()
    if (!categories) return <></>
    const imagesUrl = [
        "/categoryImages/ban-nha-dat.webp",
        "/categoryImages/cho-thue.webp",
        "/categoryImages/du-an.webp",
        "/categoryImages/bietThuChoThue.webp",
        "/categoryImages/chungCu.webp",
        "/categoryImages/nhaPho.webp",
    ]
    const defaultCategories = categories.filter((category) => category.level === 1)
    defaultCategories.forEach((category) => {
        const secondLevelCategories = categories.find((cat) => cat.parentId === category.id)
        if (secondLevelCategories) {
            defaultCategories.push(secondLevelCategories)
        }
    })
    if (!defaultCategories) {
        return <></>
    }
    return (
        <PageWrapper className='!px-0 bg-none '>
            <Card className={cn("p-0 bg-transparent border-none shadow-none", className)}>
                <CardContent className='p-0 gap-4 min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {CategoriesRender(filterCategories ? filterCategories : defaultCategories,imagesUrl)}
                </CardContent>
            </Card>
        </PageWrapper>
    )
}

export default CategoryPicker