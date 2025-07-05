import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, validateCategoryPath, getCategoriesByParentId } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import FilterBar from "@/components/filterComponent/FilterBar";

// ISR Configuration - Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListing1LevelDeep({ params,searchParams }: PageProps) {
    const { categoryLevel1 } = await params;
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}`);
    const categories = await getCategories();
    const result = await getPostByCategoryPath(categoryLevel1);
    const searchConditions = await searchParams;
    if (!isValidPath || !categories) {
        notFound();
    }
    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1
    });
    return (
        <section className="flex flex-col gap-4 container xl:px-0">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar
                    level1Slug={categoryLevel1}
                />
            </div> 
            <div className="flex flex-col gap-4 my-4">
                <div className="min-w-full">
                    <ProductsContainer
                        data={result || []}
                        searchParam={searchConditions}
                        />
                </div>
            </div>
            {article && (
                <div className="my-16">
                    <ArticleContent article={article} />
                </div>
            )}
        </section>
    );
}

// Static generation for level 1 categories
export async function generateStaticParams() {
    const topLevelCategories = await getCategoriesByParentId(null);
    
    return topLevelCategories.map((category) => ({
        categoryLevel1: category.slug || category.id.toString(),
    }));
}