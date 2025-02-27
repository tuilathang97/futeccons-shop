import FilterEstateKind from '@/components/filterComponent/FilterEstateKind'
import FilterEstateTransaction from '@/components/filterComponent/FilterEstateTransaction'
import FilterEstateType from '@/components/filterComponent/FilterEstateType'
import ProductsListWithFilter from '@/components/filterComponent/ProductsListWithFilter'
import { getCategories, getCategoryBySlug } from '@/lib/queries/categoryQueries'
import Link from 'next/link'
import React from 'react'

async function page({ params }: { params: Promise<{categoryLevel1: string, categoryLevel2: string,categoryLevel3: string}> }) {
    const {categoryLevel1,categoryLevel2,categoryLevel3} = await params
    const parentCategory = await getCategoryBySlug(`/${categoryLevel1}`)
    const currentCategory = await getCategoryBySlug(`/${categoryLevel1}/${categoryLevel2}`)
    const categories = await getCategories()
    const currentSubChildCategory = await getCategoryBySlug(`/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`)
    const filteredCategories = categories.filter((e) => e.level === parentCategory.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === parentCategory.id )
    const filteredSubChildCategories = categories.filter((e) => e.parentId === currentCategory.id )
    if(!currentSubChildCategory){
        return <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
    }
    return (
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center md:justify-normal items-center gap-4">
            <ProductsListWithFilter />
            <FilterEstateTransaction currentCategory={parentCategory} categories={filteredCategories}/>
            <FilterEstateType childCategories={filteredChildCategories} currentChildCategory={currentCategory}/>
            {filteredSubChildCategories && <FilterEstateKind childSubCategories={filteredSubChildCategories} CurrentSubCategory={currentSubChildCategory} />}
        </div>
    )
}

export default page