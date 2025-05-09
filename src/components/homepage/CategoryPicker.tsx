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
        <div className='bg-white container  py-4 flex flex-col gap-4 rounded-md'>
            <h1 className='text-lg font-semibold px-4'>Bất động sản: Mua bán, cho thuê nhà đất toàn quốc T2/2025</h1>
            <div className='flex gap-4 items-center justify-around'>
                {
                    firstLevelCategories.map((category,key) => {
                        return (
                            <Link key={key} href={category.slug ? category.slug : "/"} className='flex flex-col gap-2 w-fit items-center'>
                                <div className='bg-slate-900 p-1 rounded-md'><HouseIcon color='white' size={80}/></div>
                                <p>{category.name}</p>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategoryPicker