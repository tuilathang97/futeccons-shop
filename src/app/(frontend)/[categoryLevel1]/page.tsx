import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { validateCategoryPath, getCategoriesByParentId } from "@/lib/queries/categoryQueries";
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
    const searchConditions = await searchParams;
    
    const [isValidPath, result, article] = await Promise.all([
        validateCategoryPath(`/${categoryLevel1}`),
        getPostByCategoryPath(categoryLevel1),
        getPublishedArticleByParams({
            level1Slug: categoryLevel1
        })
    ]);
    
    if (!isValidPath) {
        notFound();
    }
    return (
        <section className="flex flex-col gap-4 container pt-4 md:pt-8 2xl:px-0">
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