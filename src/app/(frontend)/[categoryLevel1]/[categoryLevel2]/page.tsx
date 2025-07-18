import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { validateCategoryPath, getCategoriesByParentId } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import FilterBar from "@/components/filterComponent/FilterBar";

// ISR Configuration - Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export default async function ProductListing2LevelDeep({ params,searchParams }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { categoryLevel1,categoryLevel2} = await params;
    const searchConditions = await searchParams;
    
    const [isValidPath, data, article] = await Promise.all([
        validateCategoryPath(`/${categoryLevel1}/${categoryLevel2}`),
        getPostByCategoryPath(categoryLevel1, categoryLevel2),
        getPublishedArticleByParams({
            level1Slug: categoryLevel1,
            level2Slug: categoryLevel2
        })
    ]);
    
    if (!isValidPath) {
        notFound();
    }
    return (
        <section className="flex flex-col gap-4 pt-4 md:pt-8">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar 
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                />
            </div>
            <div className="flex flex-col gap-4 my-4">
                <div className="min-w-full">
                    <ProductsContainer
                        data={data || []}
                        searchParam={searchConditions}
                        />
                </div>
            </div>

            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </section>
    );
}

// Static generation for level 2 categories
export async function generateStaticParams() {
    const topLevelCategories = await getCategoriesByParentId(null);
    const allParams = [];
    
    for (const level1Category of topLevelCategories) {
        const level2Categories = await getCategoriesByParentId(level1Category.id);
        
        for (const level2Category of level2Categories) {
            allParams.push({
                categoryLevel1: level1Category.slug || level1Category.id.toString(),
                categoryLevel2: level2Category.slug || level2Category.id.toString(),
            });
        }
    }
    
    return allParams;
}
