"use client"
import { useCategories } from '@/contexts/CategoriesContext'
import { HouseIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import PageWrapper from '../PageWrapper'

function CategoryPicker() {
    const {categories} = useCategories()
    if(!categories) return <></>
    const firstLevelCategories = categories.filter((category) => category.level === 1)
    if(!firstLevelCategories){
        return <></>
    }
    return (
        <PageWrapper className='bg-white py-4 flex flex-col gap-4 rounded-md'>
            <h1 className='text-lg font-semibold px-4'>Bất động sản: Mua bán, cho thuê nhà đất toàn quốc T2/2025</h1>
            <div className='flex flex-grow   gap-4 items-center justify-around'>
                {
                    firstLevelCategories.map((category,key) => {
                        return (
                            <Link key={key} href={category.slug ? category.slug : "/"} className='flex flex-col  gap-2 w-fit items-center'>
                                <div className='bg-slate-50 p-1 rounded-md'><HouseIcon strokeWidth={1} color='black' size={60}/></div>
                                <p>{category.name}</p>
                            </Link>
                        )
                    })
                }
            </div>
        </PageWrapper>
    )
}

export default CategoryPicker