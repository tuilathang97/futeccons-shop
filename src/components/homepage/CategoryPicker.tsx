"use client"
import { useCategories } from '@/contexts/CategoriesContext'
import Link from 'next/link'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Category } from '@/db/schema'
import { Building2 } from 'lucide-react'
import { Button } from '../ui/button'

interface CategoryPickerProps {
    filterCategories?: Category[]
    className?: string
}

function CategoryPicker({ filterCategories, className }: CategoryPickerProps) {
    const [activeCategory, setActiveCategory] = useState(0)
    const { categories } = useCategories()
    if (!categories) return <></>
    const firstLevelCategories = categories.filter((category) => category.level === 1)
    if (!firstLevelCategories) {
        return <></>
    }
    function renderCategories(categories: Category[]) {
        return categories.map((category, index) => {
            return (
                <button
                    key={category.id || index}
                    onClick={() => setActiveCategory(index)}
                    className={cn("group flex flex-col opacity-80 items-center gap-2 p-3 transition-colors hover:border-b-2 hover:border-brand-medium hover:opacity-100",index === activeCategory ? "border-b-2 border-brand-medium" : "")}
                >
                    <div className="flex flex-col-reverse items-center gap-2">
                        <p className="text-sm text-center font-medium">{category.name}</p>
                        <Building2 size={36} scale={1} />
                    </div>
                </button>
            )
        })
    }

    return (
        <>
            <Card className={cn("w-full container", className)}>
                <CardContent className='p-0 flex items-center py-4 '>
                    <div className="flex gap-4">
                        {renderCategories(filterCategories ? filterCategories : firstLevelCategories)}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default CategoryPicker