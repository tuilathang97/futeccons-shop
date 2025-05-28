import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, validateCategoryPath } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import PageWrapper from "@/components/PageWrapper";
import FilterBar from "@/components/filterComponent/FilterBar";
import CategoryPicker from "@/components/homepage/CategoryPicker";
import Sidebar from "@/components/location/Sidebar";

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
}

export default async function ProductListing1LevelDeep({ params }: PageProps) {
    const { categoryLevel1 } = await params;
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}`);
    const categories = await getCategories();
    const result = await getPostByCategoryPath(categoryLevel1);
    if (!isValidPath || !categories) {
        notFound();
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1
    });
    const postImages = await getPostImages();
    const currentCategory = categories.find(category => category.slug === `/${categoryLevel1}`);
    const selectedCategories = categories.filter(cate => cate.parentId === currentCategory?.id);
    return (
        <PageWrapper className="flex flex-col 2xl:px-0 w-full gap-4 ">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar
                    level1Slug={categoryLevel1}
                />
            </div> 
            <div>
                {
                    <CategoryPicker filterCategories={selectedCategories} className="mt-4" />
                }
            </div>
            <PageWrapper className="flex !px-0 flex-col gap-4 my-4 lg:grid lg:grid-cols-[60%_40%]">
                <div className="min-w-full">
                    <ProductsContainer
                        data={result || []}
                        postImages={postImages}
                        searchParam={{}}
                        cardVariant="horizontal"
                    />
                </div>
                <div className="mt-4 md:mt-0 lg:pr-4">
                    <Sidebar />
                </div>
            </PageWrapper>
            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </PageWrapper>
    );
}