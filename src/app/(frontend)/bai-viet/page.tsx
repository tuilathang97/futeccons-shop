import ProductsContainer from "@/components/post/ProductsContainer";
import { getPosts, getPublishedArticleByParams } from "@/lib/queries";
import ArticleContent from "@/components/articles/ArticleContent";
import FilterBar from "@/components/filterComponent/FilterBar";

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BaiViet({searchParams }: PageProps) {
    const searchConditions = await searchParams;
    const posts = await getPosts();
    const article = await getPublishedArticleByParams({
        level1Slug: "bai-viet"
    });
    return (
        <section className="flex flex-col gap-4 container">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar
                    level1Slug={"bai-viet"}
                />
            </div> 
            <div className="flex flex-col gap-4 my-4">
                <div className="min-w-full">
                    <ProductsContainer
                        data={posts.data || []}
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