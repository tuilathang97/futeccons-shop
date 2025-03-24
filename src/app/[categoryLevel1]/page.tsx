import FilterArea from "@/components/filterComponent/FilterArea";
import FilterBedrooms from "@/components/filterComponent/FilterBedrooms";
import FilterEstateKind from "@/components/filterComponent/FilterEstateKind";
import FilterEstateTransaction from "@/components/filterComponent/FilterEstateTransaction";
import FilterEstateType from "@/components/filterComponent/FilterEstateType";
import FilterPrice from "@/components/filterComponent/FilterPrice";
import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import ProductsContainer from "@/components/post/ProductsContainer";
import { Button } from "@/components/ui/button";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categoryQueries";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";


interface paramsI {
    categoryLevel1: string
}

export default async function Page1({ params,searchParams }: { params: Promise<paramsI>,searchParams:any}) {
    const { categoryLevel1 } = await params;
    const result = await getPostByCategoryPath(categoryLevel1);
    const searchParam = await searchParams
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
        <section className="flex flex-col w-full gap-4">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <Button variant={"outline"}>Lọc <ArrowDownIcon/></Button>
                <ProductsListWithFilter />
                <FilterEstateTransaction currentCategory={currentParentCategory} categories={filteredCategories}/>
                <FilterEstateType childCategories={filteredChildCategories}/>
                <FilterEstateKind />
                <FilterPrice priceType="sale" />
                <FilterArea/>
                <FilterBedrooms/>
            </div>
            <div>
                <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
            </div>
            <div className="flex flex-col grid-cols-6 gap-4 md:grid">
                <ProductsContainer data={result} searchParam={searchParam}/>
                <div className="col-span-2"></div>
            </div>
        </section> :
        <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
}