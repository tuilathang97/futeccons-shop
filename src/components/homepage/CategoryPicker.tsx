"use client"
import { useCategories } from '@/contexts/CategoriesContext'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Category } from '@/db/schema'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGE_PLACEHOLDER } from '@/constants/provinces-config'
interface CategoryPickerProps {
    filterCategories?: Category[]
    className?: string
}


function CategoriesRender(categories: Category[], imagesUrl: string[]) {
    const renderCategories = categories.map((category, index) => {
        return (
            <Link
                href={category.path || "/"}
                key={category.id || index}
                className="group hover:shadow-lg min-w-full min-h-full flex flex-col items-center gap-2 rounded-md transition-colors hover:bg-slate-50"
            >
                <div className='relative min-w-full hover:shadow-md transition-shadow duration-300'>
                    <div className="relative w-full h-40">
                        <Image
                            src={imagesUrl[index]}
                            alt={`Ảnh minh hoạ danh mục ${category.name}`} 
                            fill
                            className="object-cover rounded-md group-hover:brightness-[75%] transition-all duration-300 brightness-50"
                            placeholder="blur"
                            blurDataURL={IMAGE_PLACEHOLDER}
                            loading="lazy"
                            sizes="(max-width: 350px) 100vw,(max-width: 640px) 100vw,(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <p className="text-2xl flex justify-center w-full text-center flex text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 font-bold">{category.name}</p>
                </div>
            </Link>
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
        <div className='container py-4 md:py-[32px] flex flex-col gap-4 2xl:px-0'>
            <h2 className='text-2xl font-bold font-montserrat '>Tìm kiếm theo loại danh mục</h2>
            <Card className={cn("p-0 bg-transparent border-none shadow-none", className)}>
                <CardContent className='p-0 gap-4 min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {CategoriesRender(filterCategories ? filterCategories : defaultCategories, imagesUrl)}
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoryPicker