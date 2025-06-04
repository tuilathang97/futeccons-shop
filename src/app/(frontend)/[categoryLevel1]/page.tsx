import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, validateCategoryPath } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import FilterBar from "@/components/filterComponent/FilterBar";
import Sidebar from "@/components/location/Sidebar";

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
    const postImages = await getPostImages();
    return (
        <section className="flex flex-col gap-4">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar
                    level1Slug={categoryLevel1}
                />
            </div> 
            <div className="flex flex-col gap-4 my-4 md:grid md:grid-cols-[70%_30%]">
                <div className="min-w-full">
                    <ProductsContainer
                        data={result || []}
                        postImages={postImages}
                        cardVariant="horizontal"
                        searchParam={searchConditions}
                        />
                </div>
                <div className="max-w-full md:px-4">
                    <Sidebar />
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