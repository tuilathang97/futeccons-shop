import ProductsContainer from "@/components/post/ProductsContainer";
import { Button } from "@/components/ui/button";
import { getPostByCategoryPath } from "@/lib/queries";
import { validateCategoryPath } from "@/lib/queries/categoryQueries";
import { ArrowDownIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import PageWrapper from "@/components/PageWrapper";
import FilterBar from "@/components/filterComponent/FilterBar";

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
}

export default async function ProductListing1LevelDeep({ params }: PageProps) {
    const { categoryLevel1 } = await params;
    
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}`);
    if (!isValidPath) {
        notFound();
    }

    const result = await getPostByCategoryPath(categoryLevel1);

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1
    });
    const postImages = await getPostImages();

    return (
        <PageWrapper className="flex flex-col 2xl:px-0 w-full gap-4 ">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <Button variant={"outline"}>Lọc <ArrowDownIcon /></Button>
                <FilterBar 
                    level1Slug={categoryLevel1}
                />
            </div>
            <div>
                <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                <ProductsContainer data={result || []} postImages={postImages} searchParam={{}} cardVariant="horizontal" />
                <div className="col-span-2"></div>
            </div>
            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </PageWrapper>
    );
}