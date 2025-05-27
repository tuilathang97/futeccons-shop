"use client"
import { useCategories } from '@/contexts/CategoriesContext'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Category } from '@/db/schema'
import { Building2 } from 'lucide-react'

interface CategoryPickerProps {
    filterCategories?: Category[]
    className?: string
}

function CategoryPicker({ filterCategories, className }: CategoryPickerProps) {
    const { categories } = useCategories()
    if (!categories) return <></>
    const firstLevelCategories = categories.filter((category) => category.level === 1)
    if (!firstLevelCategories) {
        return <></>
    }
    function renderCategories(categories: Category[]) {
        return categories.map((category, index) => {
            return (
                <Link
                    key={category.id || index}
                    href={category.slug || "/"}
                    className="group flex flex-col items-center gap-2 p-3 rounded-md transition-colors hover:bg-slate-50"
                >
                    <div className="flex flex-col-reverse items-center gap-2">
                        <p className="text-sm text-center font-medium">{category.name}</p>
                        <Building2 size={36} scale={1} />
                    </div>
                </Link>
            )
        })
    }

    return (
        <>
            <Card className={cn("w-full", className)}>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Bất động sản: Mua bán, cho thuê nhà đất toàn quốc T2/2025
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {renderCategories(filterCategories ? filterCategories : firstLevelCategories)}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default CategoryPicker