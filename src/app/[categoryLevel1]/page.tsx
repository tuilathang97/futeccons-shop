import FilterEstateKind from "@/components/filterComponent/FilterEstateKind";
import FilterEstateTransaction from "@/components/filterComponent/FilterEstateTransaction";
import FilterEstateType from "@/components/filterComponent/FilterEstateType";
import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categoryQueries";
import Link from "next/link";


interface paramsI {
    categoryLevel1: string
}

export default async function Page1({ params }: { params: Promise<paramsI> }) {
    const { categoryLevel1 } = await params;
    const currentParentCategory = await getCategoryBySlug(`/${categoryLevel1}`)
    if(!currentParentCategory){return (
        <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
    )}
    console.log("tôi đã được sang trang lấy slug thứ 1")
    const categories = await getCategories()
    const filteredCategories = categories.filter((e) => e.level === currentParentCategory.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === currentParentCategory.id )
    
    return currentParentCategory ?
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center md:justify-normal items-center gap-4">
                <ProductsListWithFilter />
                <FilterEstateTransaction currentCategory={currentParentCategory} categories={filteredCategories}/>
                <FilterEstateType childCategories={filteredChildCategories}/>
                <FilterEstateKind />
        </div> :
        <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
}