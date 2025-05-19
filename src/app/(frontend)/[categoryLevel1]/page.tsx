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
import { getCategories, getCategoryByPath } from "@/lib/queries/categoryQueries";
import { ArrowDownIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { getPostImages } from "@/lib/queries/postImagesQueries";

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductListing1LevelDeep({ params, searchParams }: PageProps) {
    const { categoryLevel1 } = await params;
    const result = await getPostByCategoryPath(categoryLevel1);
    const searchParam = await searchParams;
    const currentParentCategory = await getCategoryByPath(`/${categoryLevel1}`);

    if (!currentParentCategory) {
        notFound();
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1
    });
    const postImages = await getPostImages();
    const categories = await getCategories();
    const filteredCategories = categories.filter((e) => e.level === currentParentCategory.level);
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === currentParentCategory.id);

    return (
        <CategoriesProvider initialCategories={categories}>
            <section className="flex flex-col w-full gap-4 container sm:px-0 ">
                <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                    <Button variant={"outline"}>Lọc <ArrowDownIcon /></Button>
                    <ProductsListWithFilter />
                    <FilterEstateTransaction currentCategory={currentParentCategory} categories={filteredCategories} />
                    <FilterEstateType childCategories={filteredChildCategories} />
                    <FilterEstateKind />
                    <FilterPrice priceType="sale" />
                    <FilterArea />
                    <FilterBedrooms />
                </div>
                <div>
                    <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
                </div>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                    <ProductsContainer data={result || []} postImages={postImages} searchParam={searchParam} cardVariant="horizontal" />
                    <div className="col-span-2"></div>
                </div>
                {article && (
                    <div className="mt-8">
                        <ArticleContent article={article} />
                    </div>
                )}
            </section>
        </CategoriesProvider>
    );
}