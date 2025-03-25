import FilterArea from "@/components/filterComponent/FilterArea";
import FilterBedrooms from "@/components/filterComponent/FilterBedrooms";
import FilterEstateKind from "@/components/filterComponent/FilterEstateKind";
import FilterEstateTransaction from "@/components/filterComponent/FilterEstateTransaction";
import FilterEstateType from "@/components/filterComponent/FilterEstateType";
import FilterPrice from "@/components/filterComponent/FilterPrice";
import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import ProductCard from "@/components/products/ProductCard";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categoryQueries";
import Link from "next/link";

export default async function Page2({ params }: { params: Promise<{ categoryLevel1: string, categoryLevel2: string }> }) {
    const { categoryLevel1, categoryLevel2 } = await params;
    // Lấy categories
    const parentCategory = await getCategoryBySlug(`/${categoryLevel1}`)
    const currentCategory = await getCategoryBySlug(`/${categoryLevel1}/${categoryLevel2}`)
    const categories = await getCategories()
    const filteredCategories = categories.filter((e) => e.level === parentCategory.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === parentCategory.id)
    const filteredSubChildCategories = categories.filter((e) => e.parentId === currentCategory.id)
    const data = await getPostByCategoryPath(categoryLevel1, categoryLevel2)
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
        <div className="flex flex-col gap-8">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <ProductsListWithFilter />
                <FilterEstateTransaction currentCategory={parentCategory} categories={filteredCategories} />
                <FilterEstateType childCategories={filteredChildCategories} currentChildCategory={currentCategory} />
                {filteredSubChildCategories && <FilterEstateKind childSubCategories={filteredSubChildCategories} />}
                <FilterPrice priceType="sale" />
                <FilterArea />
                <FilterBedrooms />
            </div>
            <div>
                <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
            </div>
            <div className="flex flex-col grid-cols-6 gap-4 sm:grid">
                <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
                    {data && data.length > 0 ? data.map((data, index) => {
                        return (
                            <ProductCard variant="horizontal" post={data} key={index} />
                        )
                    }) : <div>no post found</div>
                    }
                </div>
                <div className="col-span-2"></div>
            </div>
        </div>
        : <div>
            <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
        </div>
    )
}
