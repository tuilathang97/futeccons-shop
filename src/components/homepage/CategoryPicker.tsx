import { Category } from '@/db/schema'
import { HouseIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CategoryPicker({categories}:{categories:Category[]}) {
    const firstLevelCategories = categories.filter((category) => category.level === 1)
    if(!firstLevelCategories){
        return <></>
    }
    return (
        <div className='flex flex-col gap-4 py-4 bg-white rounded-md'>
            <h1 className='px-4 text-lg font-semibold'>Bất động sản: Mua bán, cho thuê nhà đất toàn quốc T2/2025</h1>
            <div className='flex flex-wrap items-center justify-around gap-4'>
                {
                    firstLevelCategories.map((category,key) => {
                        return (
                            <Link key={key} href={category.slug ? category.slug : "/"} className='flex flex-col items-center group w-fit'>
                                <div className='p-1 rounded-md group-hover:bg-gray-100'><HouseIcon size={80}/></div>
                                <p className='text-base font-semibold'>{category.name}</p>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategoryPicker