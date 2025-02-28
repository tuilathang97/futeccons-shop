import FilterArea from "@/components/filterComponent/FilterArea";
import FilterBedrooms from "@/components/filterComponent/FilterBedrooms";
import FilterEstateKind from "@/components/filterComponent/FilterEstateKind";
import FilterEstateTransaction from "@/components/filterComponent/FilterEstateTransaction";
import FilterEstateType from "@/components/filterComponent/FilterEstateType";
import FilterPrice from "@/components/filterComponent/FilterPrice";
import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import { Button } from "@/components/ui/button";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categoryQueries";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";


interface paramsI {
    categoryLevel1: string
}

export default async function Page1({ params }: { params: Promise<paramsI>}) {
    const { categoryLevel1 } = await params;
    const currentParentCategory = await getCategoryBySlug(`/${categoryLevel1}`)
    if(!currentParentCategory){return (
        <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
    )}
    const categories = await getCategories()
    const filteredCategories = categories.filter((e) => e.level === currentParentCategory.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === currentParentCategory.id )
    
    return currentParentCategory ?
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center md:justify-normal items-center gap-4">
                <Button variant={"outline"}>Lọc <ArrowDownIcon/></Button>
                <ProductsListWithFilter />
                <FilterEstateTransaction currentCategory={currentParentCategory} categories={filteredCategories}/>
                <FilterEstateType childCategories={filteredChildCategories}/>
                <FilterEstateKind />
                <FilterPrice priceType="sale" />
                <FilterArea/>
                <FilterBedrooms/>
        </div> :
        <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
}