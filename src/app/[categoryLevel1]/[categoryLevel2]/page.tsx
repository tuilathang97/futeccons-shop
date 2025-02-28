import FilterArea from "@/components/filterComponent/FilterArea";
import FilterBedrooms from "@/components/filterComponent/FilterBedrooms";
import FilterEstateKind from "@/components/filterComponent/FilterEstateKind";
import FilterEstateTransaction from "@/components/filterComponent/FilterEstateTransaction";
import FilterEstateType from "@/components/filterComponent/FilterEstateType";
import FilterPrice from "@/components/filterComponent/FilterPrice";
import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import {  getCategories, getCategoryBySlug } from "@/lib/queries/categoryQueries";
import Link from "next/link";

export default async function Page2({ params }: { params: Promise<{categoryLevel1: string, categoryLevel2: string}> }) {
    const { categoryLevel1, categoryLevel2 } = await params;
    // Lấy categories
    const parentCategory = await getCategoryBySlug(`/${categoryLevel1}`)
    const currentCategory = await getCategoryBySlug(`/${categoryLevel1}/${categoryLevel2}`)
    const categories = await getCategories()
    const filteredCategories = categories.filter((e) => e.level === parentCategory.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === parentCategory.id )
    const filteredSubChildCategories = categories.filter((e) => e.parentId === currentCategory.id )
    // Validate
    if (!parentCategory || !currentCategory) {
        return (
            <div>
                <span>
                    Danh mục không tồn tại{" "}:
                    <Link href="/" className="text-red-600">
                        Quay về trang chủ
                    </Link>
                </span>
            </div>
        )
    }


    return (parentCategory ?
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center md:justify-normal items-center gap-4">
            <ProductsListWithFilter />
            <FilterEstateTransaction currentCategory={parentCategory} categories={filteredCategories}/>
            <FilterEstateType childCategories={filteredChildCategories} currentChildCategory={currentCategory}/>
            {filteredSubChildCategories && <FilterEstateKind childSubCategories={filteredSubChildCategories}/>}
            <FilterPrice priceType="sale" />
            <FilterArea/>
            <FilterBedrooms/>
        </div> :  <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
    )
}
